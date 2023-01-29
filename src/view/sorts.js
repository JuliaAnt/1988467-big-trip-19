import AbstractView from '../framework/view/abstract-view.js';

const SortType = {
  DEFAULT: 'default',
  PRICE_DESC: 'price-desc',
  TIME_DESC: 'time-desc',
};

const SortNames = ['day', 'event', 'time', 'price', 'offer'];

const TYPE_SORT_MAP = {
  day: SortType.DEFAULT,
  time: SortType.TIME_DESC,
  price: SortType.PRICE_DESC
};

function createSortListTemplate(currentSortType) {
  return SortNames.map((sortName) => {
    const typeSorts = TYPE_SORT_MAP[sortName] || '';
    return (
      `<div class="trip-sort__item  trip-sort__item--${sortName}">
        <input id="sort-${sortName}" class="trip-sort__input  visually-hidden" data-sort-type="${typeSorts}"
          type="radio" name="trip-sort" value="sort-${sortName}"
          ${typeSorts === currentSortType ? 'checked' : ''}
          ${sortName === 'event' || sortName === 'offer' ? 'disabled' : ''}
        >
        <label class="trip-sort__btn" for="sort-${sortName}">${sortName}</label>
      </div>`
    );
  }).join('');
}

function createSortsTemplate(currentSortType) {
  const sortList = createSortListTemplate(currentSortType);
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortList}
    </form>`
  );
}

export default class SortsView extends AbstractView {
  #currentSortType = null;
  #handlerSortTypeChange = null;

  constructor({ currentSortType, onSortTypeChange }) {
    super();
    this.#handlerSortTypeChange = onSortTypeChange;
    this.#currentSortType = currentSortType || SortType.DEFAULT;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {

    return createSortsTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    const target = evt.target.closest('.trip-sort__input');

    if (!target) {
      return;
    }

    evt.preventDefault();
    this.#currentSortType = evt.target.dataset.sortType;


    this.#handlerSortTypeChange(this.#currentSortType);
  };

}


export { SortType };
