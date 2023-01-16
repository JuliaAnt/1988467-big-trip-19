import FiltersView from './view/filters.js';
import SortsView from './view/sorts.js';
import EventsView from './view/event-list.js';
import EventView from './view/event.js';
import { remove, render, RenderPosition } from './framework/render.js';
import PointsModel from './model.js';
import EmptyEventsView from './view/empty-events.js';
import { offersByType, pointTypes, cities } from './mock/mock-data.js';
import PointPresenter from './point-presenter.js';
import { updateItem, sortDayDesc, sortTimeDesc, sortPriceDesc } from './utils.js';
import { SortType } from './view/sorts.js';

const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const pointsModel = new PointsModel();

class TripPresenter {
  #headerContainer = null;
  #mainContainer = null;
  #model = null;

  #waypoints = [];
  #pointPresenters = new Map();
  #currentSortType = SortType.DEFAULT;
  #soursedWaypoints = [];

  #eventList = new EventsView();
  #eventItem = new EventView();
  #filtersComponent = new FiltersView();
  #sortComponent = null;
  #emptyEventsComponent = new EmptyEventsView();

  constructor({ headerContainer, mainContainer, model }) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#model = model;
  }

  init() {
    this.#waypoints = [...this.#model.points];
    this.#waypoints.sort(sortDayDesc);
    this.#renderEventList();
  }

  #renderFilters() {
    render(this.#filtersComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortWaypoints(sortType);
    this.#clearEventList();
    this.#renderPoints();
    this.#renderSort();
  };

  #renderSort() {
    this.#sortComponent = new SortsView({ currentSortType: this.#currentSortType, onSortTypeChange: this.#handleSortTypeChange });
    render(this.#sortComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #sortWaypoints(sortType) {
    switch (sortType) {
      case SortType.TIME_DESC:
        this.#waypoints.sort(sortTimeDesc);
        break;
      case SortType.DEFAULT:
        this.#waypoints.sort(sortDayDesc);
        break;
      case SortType.PRICE_DESC:
        this.#waypoints.sort(sortPriceDesc);
    }

    this.#currentSortType = sortType;
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.setDefaultMode());
  };

  #handlePointChange = (updatedPoint) => {
    this.#waypoints = updateItem(this.#waypoints, updatedPoint);
    this.#soursedWaypoints = updateItem(this.#soursedWaypoints, updatedPoint);
    const pointPresenter = this.#pointPresenters.get(updatedPoint.id);
    const { types, availableCities, offers } = pointPresenter.props;
    pointPresenter.init({ types, availableCities, offers, waypoint: updatedPoint });
  };

  #renderEmptyEvents() {
    render(this.#emptyEventsComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(props) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventItem.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(props);
    this.#pointPresenters.set(props.waypoint.id, pointPresenter);
  }

  #renderPoints() {
    this.#waypoints.forEach((waypoint) => {
      const props = {
        waypoint,
        types: pointTypes,
        availableCities: cities,
        offers: offersByType,
      };
      this.#renderPoint(props);
    });
  }

  #clearEventList() {
    remove(this.#sortComponent);
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderEventList() {
    this.#renderFilters();

    if (this.#waypoints.every((waypoint) => waypoint.isArchive)) {
      return this.#renderEmptyEvents();
    }

    this.#renderSort();
    render(this.#eventList, this.#mainContainer);
    render(this.#eventItem, this.#eventList.element);
    this.#renderPoints();
  }
}

const tripPresenter = new TripPresenter({
  headerContainer: tripControlsFilters,
  mainContainer: tripEvents,
  model: pointsModel,
});

tripPresenter.init();
