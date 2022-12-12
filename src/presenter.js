import NewFilterView from './view/filters.js';
import NewSortView from './view/sorts.js';
import EventListView from './view/event-list.js';
import NewWaypointView from './view/waypoint.js';
import NewEditFormView from './view/edit-form.js';
import EventItemView from './view/event-item.js';
import NewPointFormView from './view/new-point-form.js';
import LoadingView from './view/loading.js';
import EventListEmptyView from './view/event-list-empty.js';
import { render } from './render.js';

const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

export default class TripPresenter {
  eventList = new EventListView();
  eventItem = new EventItemView();

  constructor({ headerContainer, mainContainer }) {
    this.headerContainer = headerContainer;
    this.mainContainer = mainContainer;
  }

  init() {
    render(new NewFilterView(), this.headerContainer);
    render(new NewSortView(), this.mainContainer);
    render(this.eventList, this.mainContainer);
    render(this.eventItem, this.eventList.getElement());
    render(new NewEditFormView(), this.eventItem.getElement());

    for (let i = 0; i < 3; i++) {
      render(new NewWaypointView(), this.eventItem.getElement());
    }

    render(new NewPointFormView(), this.eventItem.getElement());
    render(new LoadingView(), this.mainContainer);
    render(new EventListEmptyView(), this.mainContainer);

  }
}

const tripPresenter = new TripPresenter({ headerContainer: tripControlsFilters, mainContainer: tripEvents });
tripPresenter.init();
