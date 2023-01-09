import FiltersView from './view/filters.js';
import SortsView from './view/sorts.js';
import EventsView from './view/event-list.js';
// import WaypointView from './view/waypoint.js';
// import EditFormView from './view/edit-form.js';
import EventView from './view/event.js';
import { render, RenderPosition } from './framework/render.js';
import PointsModel from './model.js';
import EmptyEventsView from './view/empty-events.js';
import { offersByType, pointTypes, cities } from './mock/mock-data.js';
import PointPresenter from './point-presenter.js';

const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const pointsModel = new PointsModel();

class TripPresenter {
  #headerContainer = null;
  #mainContainer = null;
  #model = null;

  #waypoints = [];

  #eventList = new EventsView();
  #eventItem = new EventView();
  #filtersComponent = new FiltersView();
  #sortComponent = new SortsView();
  #emptyEventsComponent = new EmptyEventsView();

  constructor({ headerContainer, mainContainer, model }) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#model = model;
  }

  init() {
    this.#waypoints = [...this.#model.points];

    this.#renderEventList();
  }

  #renderFilters() {
    render(this.#filtersComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    render(this.#sortComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #renderEmptyEvents() {
    render(this.#emptyEventsComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(props) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventItem.element
    });
    pointPresenter.init(props);

    //   const pointListItem = new WaypointView({
    //     ...props,
    //     onClick: () => {
    //       replaceWaypointToEdit.call(this);
    //       document.addEventListener('keydown', escKeyDownHandler);
    //     }
    //   });

    //   const pointEditItem = new EditFormView({
    //     ...props,
    //     onEditSubmit: () => {
    //       replaceEditToWaypoint.call(this);
    //       document.removeEventListener('keydown', escKeyDownHandler);
    //     },
    //     onEditReset: () => {
    //       replaceEditToWaypoint.call(this);
    //       document.removeEventListener('keydown', escKeyDownHandler);
    //     }
    //   });

    //   function replaceWaypointToEdit() {
    //     replace(pointEditItem, pointListItem);
    //   }

    //   function replaceEditToWaypoint() {
    //     replace(pointListItem, pointEditItem);
    //   }

    //   function escKeyDownHandler(evt) {
    //     if (evt.key === 'Escape' || evt.key === 'Esc') {
    //       evt.preventDefault();
    //       replaceEditToWaypoint.call(this);
    //       document.removeEventListener('keydown', escKeyDownHandler);
    //     }
    //   }

    //   render(pointListItem, this.#eventItem.element);
  }

  #renderPoints() {
    this.#waypoints.forEach((waypoint) => {
      const props = {
        waypoint: waypoint,
        types: pointTypes,
        availableCities: cities,
        offers: offersByType,
      };
      this.#renderPoint(props);
    });
  }

  #renderEventList() {
    this.#renderFilters();

    if (this.#waypoints.every((waypoint) => waypoint.isArchive)) {
      this.#renderEmptyEvents();
      return;
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
