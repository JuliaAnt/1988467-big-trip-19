import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filters, currentFilterType) {
  return filters.map((filter) => (
    `<div class="trip-filters__filter">
      <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
        value="${filter.name}" ${filter.name === currentFilterType ? 'checked' : ''}
        ${filter.count === 0 ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
    </div>`
  )).join('');
}

function createFiltersTemplate(filters, currentFilterType) {
  const filterItemTemplate = createFilterItemTemplate(filters, currentFilterType);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
