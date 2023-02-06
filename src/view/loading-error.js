import AbstractView from '../framework/view/abstract-view.js';

function createLoadingErrorTemplate() {
  return (
    `<p class="trip-events__msg">
      Loading Error. Failed to load complete data
    </p>`
  );
}

export default class LoadingErrorView extends AbstractView {
  get template() {
    return createLoadingErrorTemplate();
  }
}
