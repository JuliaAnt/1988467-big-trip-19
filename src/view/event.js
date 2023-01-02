import AbstractView from '../framework/view/abstract-view.js';

function createEventTemplate() {
  return '<li class="trip-events__item"></li>';
}

export default class EventView extends AbstractView {
  get template() {
    return createEventTemplate();
  }
}
