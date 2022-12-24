import { createElement } from '../render.js';

function createLoadingTemplate() {
  return '<p class="trip-events__msg">Loading...</p>';
}

export default class LoadingView {
  #item = null;

  get template() {
    return createLoadingTemplate();
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
