import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizePointDateAndTime } from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

function createOfferListTemplate(offers, waypoint, isDisabled) {
  const pointTypeOffer = offers.find((offerToFind) => offerToFind.type === waypoint.type);

  return pointTypeOffer.offers.map((offer) => (
    `<div class="event__offer-selector" data-offer-id="${offer.id}">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal" ${waypoint.offers.includes(offer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="event-offer-meal-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  )).join('');
}

function createTypeListTemplate(types, waypoint, isDisabled) {
  return types.map((type) => (
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${waypoint.type === type ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`
  )).join('');
}

function createCityListTemplate(availableCities) {
  return availableCities.map((city) => (
    `<option value="${city}"></option>`
  )).join('');
}

function createDestinationTemplate(waypoint, destinations) {
  const pointDestination = destinations.find((destinationToFind) => waypoint.destination === destinationToFind.id);
  return pointDestination.description && pointDestination.pictures ?
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${pointDestination.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${pointDestination.pictures.map((i) => (`<img class="event__photo" src="${i.src}" alt="${i.description}">`))}
        </div>
      </div>
    </section>` : '';
}

function createEditFormsTemplate(data) {
  const { waypoint, types, availableCities, offers, destinations, isDisabled, isSaving, isDeleting } = data;
  const typeList = createTypeListTemplate(types, waypoint, isDisabled);
  const cityList = createCityListTemplate(availableCities);
  const offerList = createOfferListTemplate(offers, waypoint, isDisabled);
  const dateFrom = humanizePointDateAndTime(waypoint.dateFrom);
  const dateTo = humanizePointDateAndTime(waypoint.dateTo);
  const descriptionDest = createDestinationTemplate(waypoint, destinations);
  const pointDestination = destinations.find((destinationToFind) => waypoint.destination === destinationToFind.id);

  return (
    `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${waypoint.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${typeList}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${waypoint.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(pointDestination.name)}" list="destination-list-2" ${isDisabled ? 'disabled' : ''} required>
          <datalist id="destination-list-2">
          ${cityList}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}" ${isDisabled ? 'disabled' : ''} required>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}" ${isDisabled ? 'disabled' : ''} required>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${waypoint.basePrice}" ${isDisabled ? 'disabled' : ''} required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
        <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offerList}
          </div>
        </section>

        ${waypoint.destination ? descriptionDest : ''}
      </section>
    </form>`
  );
}

export default class EditFormView extends AbstractStatefulView {
  #handleEditSubmit = null;
  #handleEditReset = null;
  #handleDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({ waypoint, types, availableCities, offers, destinations, onEditSubmit, onEditReset, onDeleteClick }) {
    super();
    this._setState(EditFormView.parsePointToState({ waypoint, types, availableCities, offers, destinations }));
    this.#handleEditSubmit = onEditSubmit;
    this.#handleEditReset = onEditReset;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#editSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editResetHandler);
    this.element.addEventListener('reset', this.#deleteClickHandler);

    this.element.querySelector('.event__type-list').addEventListener('click', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('keyup', this.#priceChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('click', this.#offersChangeHnadler);

    this.#setDatepicker();
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement(
      this._state.waypoint.type = evt.target.textContent,
      this._state.waypoint.offers = []
    );
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    if (!this._state.availableCities.includes(evt.target.value)) {
      evt.target.setCustomValidity('Выберите город из списка.');
    }

    this._state.destinations.find((destinationItem) => destinationItem.name === evt.target.value ?
      this.updateElement(
        this._state.waypoint.destination = destinationItem.id
      ) : '');
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    evt.target.value = evt.target.value.replace(/[^\d]/g, '');
    this._setState(this._state.waypoint.basePrice = +evt.target.value);
  };

  #offersChangeHnadler = (evt) => {
    const target = evt.target.closest('.event__offer-selector');

    if (!target) {
      return;
    }

    evt.preventDefault();
    const offerId = +target.dataset.offerId;
    const index = this._state.waypoint.offers.findIndex((offer) => offer === offerId);

    if (index === -1) {
      this._state.waypoint.offers.push(offerId);
    } else {
      this._state.waypoint.offers.splice(index, 1);
    }

    this.updateElement(this._state.waypoint.offers);
  };

  get template() {
    return createEditFormsTemplate(this._state);
  }

  reset(waypoint) {
    this.updateElement(
      EditFormView.parsePointToState(waypoint)
    );
  }

  #editSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditSubmit(EditFormView.parseStateToPoint(this._state.waypoint));
  };

  #editResetHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditReset(EditFormView.parseStateToPoint(this._state));
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditFormView.parseStateToPoint(this._state));
  };

  static parsePointToState(waypoint) {
    return {
      ...waypoint,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    delete state.isDisabled;
    delete state.isSaving;
    delete state.isDeleting;

    return { ...state };
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  #dateFromChangeHandler = (dateFrom) => {
    this.updateElement(
      this._state.waypoint.dateFrom = dateFrom
    );
  };

  #dateToChangeHandler = (dateTo) => {
    this.updateElement(
      this._state.waypoint.dateTo = dateTo
    );
  };

  #setDatepicker() {
    const dateFrom = this.element.querySelector('#event-start-time-1');
    const dateTo = this.element.querySelector('#event-end-time-1');

    this.#datepickerFrom = flatpickr(
      dateFrom,
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        onChange: this.#dateFromChangeHandler,
      }
    );

    this.#datepickerTo = flatpickr(
      dateTo,
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.waypoint.dateFrom,
        onChange: this.#dateToChangeHandler,
      }
    );
  }
}
