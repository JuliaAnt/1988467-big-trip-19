import SortsView from '../view/sorts.js';
import EventsView from '../view/event-list.js';
import EventView from '../view/event.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import PointsModel from '../models/model.js';
import EmptyEventsView from '../view/empty-events.js';
import { offersByType, pointTypes, cities, destinations } from '../mock/mock-data.js';
import PointPresenter from './point-presenter.js';
import { sortDayDesc, sortTimeDesc, sortPriceDesc, filter } from '../utils.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import FilterModel from '../models/filter-model.js';
import FilterPresenter from './filter-presenter.js';

const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const filtersModel = new FilterModel();

class TripPresenter {
  #headerContainer = null;
  #mainContainer = null;
  #model = null;
  #filterModel = null;

  #pointPresenters = new Map();
  #filterPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;

  #eventList = new EventsView();
  #eventItem = new EventView();
  #sortComponent = null;
  #emptyEventsComponent = null;

  constructor({ headerContainer, mainContainer, model, filterModel }) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#model = model;
    this.#filterModel = filterModel;

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

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.setDefaultMode());
  };

  #handlePointChange = (updatedPoint) => {
    const pointPresenter = this.#pointPresenters.get(updatedPoint.id);
    const { types, availableCities, offers } = pointPresenter.props;
    pointPresenter.init({ types, availableCities, offers, destinations, waypoint: updatedPoint });
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#model.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#model.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#model.deletePoint(updateType, update);
        break;
    }
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
    }
  };

  #renderEmptyEvents = () => {
    this.#emptyEventsComponent = new EmptyEventsView(this.#filterType);
    render(this.#emptyEventsComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (props) => {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventItem.element,
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
        types: pointTypes,
        availableCities: cities,
        offers: offersByType,
        destinations: destinations,
      };
      this.#renderPoint(props);
    });
  };

  #clearEventList = ({ resetSortType = false } = {}) => {
    remove(this.#sortComponent);

    if (this.#emptyEventsComponent) {
      remove(this.#emptyEventsComponent);
    }

    this.#filterPresenter.destroy();

    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderEventList = () => {
    this.#renderFilters();

    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      return this.#renderEmptyEvents();
    }

    this.#renderSort();
    render(this.#eventList, this.#mainContainer);
    render(this.#eventItem, this.#eventList.element);
    this.#renderPoints(this.points);
  };
}

const tripPresenter = new TripPresenter({
  headerContainer: tripControlsFilters,
  mainContainer: tripEvents,
  model: pointsModel,
  filterModel: filtersModel,
});

tripPresenter.init();
