import { createElement } from '../render.js';

function createEmptyEventsTemplate() {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
}

export default class EmptyEventsView {
  constructor() {
    this.element = null;
  }

  getTemplate() {
    return createEmptyEventsTemplate();
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
