import { createElement } from '../render.js';

function createEventTemplate() {
  return '<li class="trip-events__item"></li>';
}

export default class EventView {
  #item = null;

  get template() {
    return createEventTemplate();
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
