import { createElement } from '../render.js';

function createEventTemplate() {
  return '<li class="trip-events__item"></li>';
}

export default class EventView {
  constructor() {
    this.element = null;
  }

  getTemplate() {
    return createEventTemplate();
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
