import FiltersView from './view/filters.js';
import SortsView from './view/sorts.js';
import EventsView from './view/event-list.js';
import WaypointView from './view/waypoint.js';
import EditFormView from './view/edit-form.js';
import EventView from './view/event.js';
// import NewPointView from './view/new-point.js';
// import LoadingView from './view/loading.js';
// import EmptyEventsView from './view/empty-events.js';
import { render } from './render.js';
import PointsModel from './model.js';
import { offersByType } from './mock/mock-data.js';

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

    render(new FiltersView(), this.#headerContainer);
    render(new SortsView(), this.#mainContainer);
    render(this.#eventList, this.#mainContainer);
    render(this.#eventItem, this.#eventList.element);
    // render(new EditFormView({}), this.#eventItem.element);

    for (let i = 0; i < this.#waypoints.length; i++) {
      this.#renderPoint(offersByType, this.#waypoints[i]);
      // render(new WaypointView({ offers: offersByType, waypoint: this.#waypoints[i] }), this.#eventItem.element);
    }

    // render(new NewPointView({}), this.#eventItem.element);
    // render(new LoadingView(), this.#mainContainer);
    // render(new EmptyEventsView(), this.#mainContainer);
  }

  #renderPoint(offers, waypoint) {
    const pointListItem = new WaypointView({ offers, waypoint });
    const pointEditItem = new EditFormView({});

    render(pointListItem, this.#eventItem.element);
    render(pointEditItem, this.#eventItem.element);
  }

}

const tripPresenter = new TripPresenter({
  headerContainer: tripControlsFilters,
  mainContainer: tripEvents,
  model: pointsModel,
});

tripPresenter.init();
