import FiltersView from './view/filters.js';
import SortsView from './view/sorts.js';
import EventsView from './view/event-list.js';
import EventView from './view/event.js';
import { remove, render, RenderPosition } from './framework/render.js';
import PointsModel from './model.js';
import EmptyEventsView from './view/empty-events.js';
import { offersByType, pointTypes, cities, destinations } from './mock/mock-data.js';
import PointPresenter from './point-presenter.js';
import { sortDayDesc, sortTimeDesc, sortPriceDesc } from './utils.js';
import { SortType, UpdateType, UserAction } from './const.js';

const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const pointsModel = new PointsModel();

class TripPresenter {
  #headerContainer = null;
  #mainContainer = null;
  #model = null;

  #pointPresenters = new Map();
  #currentSortType = SortType.DEFAULT;

  #eventList = new EventsView();
  #eventItem = new EventView();
  #filtersComponent = new FiltersView();
  #sortComponent = null;
  #emptyEventsComponent = new EmptyEventsView();

  constructor({ headerContainer, mainContainer, model }) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#model = model;

    this.#model.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.TIME_DESC:
        return [...this.#model.points].sort(sortTimeDesc);
      case SortType.DEFAULT:
        return [...this.#model.points].sort(sortDayDesc);
      case SortType.PRICE_DESC:
        return [...this.#model.points].sort(sortPriceDesc);
    }

    return this.#model.points;
  }

  init() {
    // this.#waypoints = [...this.#model.points];
    // this.#waypoints.sort(sortDayDesc);
    this.#renderEventList();
  }

  #renderFilters = () => {
    render(this.#filtersComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearEventList();
    this.#renderEventList();
    // this.#clearEventList();
    // this.#renderPoints();
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
        // - обновить часть списка (например, когда поменялось описание)
        this.#handlePointChange(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearEventList();
        this.#renderEventList();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearEventList({ resetSortType: true });
        this.#renderEventList();
        break;
    }
  };

  #renderEmptyEvents = () => {
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
    remove(this.#emptyEventsComponent);

    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    // if (resetRenderedTaskCount) {
    //   this.#renderedTaskCount = TASK_COUNT_PER_STEP;
    // } else {
    //   // На случай, если перерисовка доски вызвана
    //   // уменьшением количества задач (например, удаление или перенос в архив)
    //   // нужно скорректировать число показанных задач
    //   this.#renderedTaskCount = Math.min(taskCount, this.#renderedTaskCount);
    // }

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
});

tripPresenter.init();
