import { createElement } from '../render.js';

function createEmptyEventsTemplate() {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
}

export default class EmptyEventsView {
  #item = null;

  get template() {
    return createEmptyEventsTemplate();
  }

  get element() {
    if (!this.#item) {
      this.#item = createElement(this.template);
    }

    return this.#item;
  }

  removeElement() {
    this.#item = null;
  }
}
