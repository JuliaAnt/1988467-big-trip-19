import AbstractView from '../framework/view/abstract-view.js';

const SortType = {
  DEFAULT: 'default',
  PRICE_DESC: 'price-desc',
  TIME_DESC: 'time-desc',
};

function createSortsTemplate(currentSortType) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <div class="trip-sort__item  trip-sort__item--day">
        <input id="sort-day" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.DEFAULT}"
         type="radio" name="trip-sort" value="sort-day" ${currentSortType === SortType.DEFAULT ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-day">Day</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.TIME_DESC}"
        type="radio" name="trip-sort" value="sort-time" ${currentSortType === SortType.TIME_DESC ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-time">Time</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.PRICE_DESC}"
         type="radio" name="trip-sort" value="sort-price" ${currentSortType === SortType.PRICE_DESC ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-price">Price</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--offer">
        <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
      </div>
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
