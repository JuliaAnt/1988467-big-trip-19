import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

function createFilterItemTemplate(currentFilterType) {
  return Object.values(FilterType).map((filter) => (
    `<div class="trip-filters__filter">
      <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${filter === currentFilterType ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
    </div>`
  )).join('');
}

function createFiltersTemplate(currentFilterType) {
  const filterItemTemplate = createFilterItemTemplate(currentFilterType);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FiltersView extends AbstractView {
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({ currentFilterType, onFilterTypeChange }) {
    super();
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
