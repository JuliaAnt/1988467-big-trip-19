import TripPresenter from './presenters/main-presenter.js';
import PointsModel from './models/model.js';
import FilterModel from './models/filter-model.js';

const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const filtersModel = new FilterModel();
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const tripPresenter = new TripPresenter({
  headerContainer: tripControlsFilters,
  mainContainer: tripEvents,
  model: pointsModel,
  filterModel: filtersModel,
  onNewPointDestroy: handleNewPointFormClose,
});

function handleNewPointButtonClick() {
  tripPresenter.createNewPoint();
  newEventButton.disabled = true;
}

function handleNewPointFormClose() {
  newEventButton.disabled = false;
}

newEventButton.addEventListener('click', handleNewPointButtonClick);

tripPresenter.init();
