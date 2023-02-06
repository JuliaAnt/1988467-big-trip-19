import SortsView from '../view/sorts.js';
import EventsView from '../view/event-list.js';
import EventView from '../view/event.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import LoadingView from '../view/loading.js';
import EmptyEventsView from '../view/empty-events.js';
import PointPresenter from './point-presenter.js';
import { sortDayDesc, sortTimeDesc, sortPriceDesc, filter } from '../utils.js';
import { SortType, UpdateType, UserAction, FilterType, TimeLimit } from '../const.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import FilterPresenter from './filter-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingErrorView from '../view/loading-error.js';

export default class TripPresenter {
  #headerContainer = null;
  #mainContainer = null;
  #model = null;
  #filterModel = null;

  #pointPresenters = new Map();
  #filterPresenter = null;
  #newPointPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  #eventList = new EventsView();
  #eventItem = new EventView();
  #sortComponent = null;
  #emptyEventsComponent = null;
  #loadingComponent = new LoadingView();
  #loadingErrorComponent = new LoadingErrorView();
  #handleNewPointDestroy = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ headerContainer, mainContainer, model, filterModel, onNewPointDestroy }) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#model = model;
    this.#filterModel = filterModel;
    this.#handleNewPointDestroy = onNewPointDestroy;

    this.#model.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#model.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME_DESC:
        return filteredPoints.sort(sortTimeDesc);
      case SortType.DEFAULT:
        return filteredPoints.sort(sortDayDesc);
      case SortType.PRICE_DESC:
        return filteredPoints.sort(sortPriceDesc);
    }

    return filteredPoints;
  }

  init() {
    this.#renderEventList();
  }

  createNewPoint() {
    const newPointProps = {
      types: this.#model.pointTypes,
      availableCities: this.#model.cities,
      offers: this.#model.offersByType,
      newDestinations: this.#model.destinations
    };

    this.#newPointPresenter = new NewPointPresenter({
      pointsCount: this.points.length,
      eventList: this.#eventList,
      eventItem: this.#eventItem,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewPointDestroy,
    });

    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (this.points.length === 0) {
      render(this.#eventList, this.#mainContainer, RenderPosition.AFTERBEGIN);
    }

    this.#newPointPresenter.init(newPointProps);
  }

  #renderFilters = () => {
    this.#filterPresenter = new FilterPresenter({
      filterContainer: this.#headerContainer,
      filterModel: this.#filterModel,
      model: this.#model
    });

    this.#filterPresenter.init();
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearEventList();
    this.#renderEventList();
  };

  #renderSort = () => {
    this.#sortComponent = new SortsView({ currentSortType: this.#currentSortType, onSortTypeChange: this.#handleSortTypeChange });
    render(this.#sortComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  };

  #renderLoadingError = () => {
    render(this.#loadingErrorComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  };

  #handleModeChange = () => {
    this.#handleNewPointDestroy();
    this.#pointPresenters.forEach((presenter) => presenter.setDefaultMode());
  };

  #handlePointChange = (updatedPoint) => {
    const pointPresenter = this.#pointPresenters.get(updatedPoint.id);
    const { types, availableCities, offers } = pointPresenter.props;
    pointPresenter.init({ types, availableCities, offers, destinations: this.#model.destinations, waypoint: updatedPoint });
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#model.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#model.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.waypoint.id).setDeleting();
        try {
          this.#model.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.waypoint.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#handlePointChange(data);
        break;
      case UpdateType.MINOR:
        this.#clearEventList();
        this.#renderEventList();
        break;
      case UpdateType.MAJOR:
        this.#clearEventList({ resetSortType: true });
        this.#renderEventList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderEventList();
    }
  };

  #renderEmptyEvents = () => {
    this.#emptyEventsComponent = new EmptyEventsView(this.#filterType);
    render(this.#emptyEventsComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (props) => {
    const pointPresenter = new PointPresenter({
      eventList: this.#eventList.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(props);
    this.#pointPresenters.set(props.waypoint.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((waypoint) => {
      const props = {
        waypoint,
        types: this.#model.pointTypes,
        availableCities: this.#model.cities,
        offers: this.#model.offersByType,
        destinations: this.#model.destinations,
      };
      this.#renderPoint(props);
    });
  };

  #clearEventList = ({ resetSortType = false } = {}) => {
    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#emptyEventsComponent) {
      remove(this.#emptyEventsComponent);
    }

    this.#filterPresenter.destroy();
    this.#handleNewPointDestroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderEventList = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#model.loadingError) {
      this.#renderLoadingError();
      return;
    }

    this.#renderFilters();

    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      return this.#renderEmptyEvents();
    }

    this.#renderSort();
    render(this.#eventList, this.#mainContainer);
    this.#renderPoints(this.points);
  };
}


