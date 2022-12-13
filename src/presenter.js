import FiltersView from './view/filters.js';
import SortsView from './view/sorts.js';
import EventsView from './view/event-list.js';
import WaypointView from './view/waypoint.js';
import EditFormView from './view/edit-form.js';
import EventView from './view/event.js';
import NewPointView from './view/new-point.js';
import LoadingView from './view/loading.js';
import EmptyEventsView from './view/empty-events.js';
import { render } from './render.js';

const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const NUMBER_OF_EVENTS = 3;

export default class TripPresenter {
  eventList = new EventsView();
  eventItem = new EventView();

  constructor({ headerContainer, mainContainer }) {
    this.headerContainer = headerContainer;
    this.mainContainer = mainContainer;
  }

  init() {
    render(new FiltersView(), this.headerContainer);
    render(new SortsView(), this.mainContainer);
    render(this.eventList, this.mainContainer);
    render(this.eventItem, this.eventList.getElement());
    render(new EditFormView(), this.eventItem.getElement());

    for (let i = 0; i < NUMBER_OF_EVENTS; i++) {
      render(new WaypointView(), this.eventItem.getElement());
    }

    render(new NewPointView(), this.eventItem.getElement());
    render(new LoadingView(), this.mainContainer);
    render(new EmptyEventsView(), this.mainContainer);

  }
}

const tripPresenter = new TripPresenter({ headerContainer: tripControlsFilters, mainContainer: tripEvents });
tripPresenter.init();
