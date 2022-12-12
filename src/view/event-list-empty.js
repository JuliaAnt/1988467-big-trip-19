import { createElement } from '../render.js';

function createEventListEmptyTemplate() {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
}


export default class EventListEmptyView {
  constructor() {
    this.element = null;
  }

  getTemplate() {
    return createEventListEmptyTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
