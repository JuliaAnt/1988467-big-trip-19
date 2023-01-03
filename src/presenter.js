import FiltersView from './view/filters.js';
import SortsView from './view/sorts.js';
import EventsView from './view/event-list.js';
import WaypointView from './view/waypoint.js';
import EditFormView from './view/edit-form.js';
import EventView from './view/event.js';
import { render, replace } from './framework/render.js';
import PointsModel from './model.js';
import EmptyEventsView from './view/empty-events.js';
import { offersByType, pointTypes, cities } from './mock/mock-data.js';

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

  constructor({ headerContainer, mainContainer, model }) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#model = model;
  }

  init() {
    this.#waypoints = [...this.#model.points];

    this.#renderEventList();
  }

  #renderPoint(props) {

    const pointListItem = new WaypointView({
      ...props,
      onClick: () => {
        replaceWaypointToEdit.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditItem = new EditFormView({
      ...props,
      onEditSubmit: () => {
        replaceEditToWaypoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onEditReset: () => {
        replaceEditToWaypoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceWaypointToEdit() {
      replace(pointEditItem, pointListItem);
    }

    function replaceEditToWaypoint() {
      replace(pointListItem, pointEditItem);
    }

    function escKeyDownHandler(evt) {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditToWaypoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    }

    render(pointListItem, this.#eventItem.element);
  }

  #renderEventList() {
    render(new FiltersView(), this.#headerContainer);

    if (this.#waypoints.every((waypoint) => waypoint.isArchive)) {
      render(new EmptyEventsView(), this.#mainContainer);
    } else {
      render(new SortsView(), this.#mainContainer);
      render(this.#eventList, this.#mainContainer);
      render(this.#eventItem, this.#eventList.element);

      for (let i = 0; i < this.#waypoints.length; i++) {
        const props = {
          waypoint: this.#waypoints[i],
          types: pointTypes,
          availableCities: cities,
          offers: offersByType,
        };
        this.#renderPoint(props);
      }
    }
  }
}

const tripPresenter = new TripPresenter({
  headerContainer: tripControlsFilters,
  mainContainer: tripEvents,
  model: pointsModel,
});

tripPresenter.init();
