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
import { SortType } from './view/sorts.js';

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
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.TIME_DESC:
        [...this.#model.points].sort(sortTimeDesc);
        break;
      case SortType.DEFAULT:
        [...this.#model.points].sort(sortDayDesc);
        break;
      case SortType.PRICE_DESC:
        [...this.#model.points].sort(sortPriceDesc);
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
    this.#renderPoints();
    this.#renderSort();
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

  #renderEmptyEvents = () => {
    render(this.#emptyEventsComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (props) => {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventItem.element,
      onDataChange: this.#handlePointChange,
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

  #clearEventList = () => {
    remove(this.#sortComponent);
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  };

  #renderEventList = () => {
    this.#renderFilters();

    if (this.points.every((waypoint) => waypoint.isArchive)) {
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
