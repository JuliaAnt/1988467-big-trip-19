import { createElement } from '../render.js';

function createEventsTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class EventsView {
  #item = null;

  get template() {
    return createEventsTemplate();
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
