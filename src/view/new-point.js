import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizePointDateAndTime } from '../utils.js';
import { pointTypes, cities, offersByType, destinations } from '../mock/mock-data.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  'base_price': '',
  'date_from': '2023-01-01T00:00:00.000Z',
  'date_to': '2023-01-01T00:00:00.000Z',
  'destination': 0,
  'id': '1',
  'is_favorite': false,
  'offers': [],
  'type': pointTypes[0],
};

function createOfferListTemplate(offers, newWaypoint) {
  const pointTypeOffer = offers.find((offerToFind) => offerToFind.type === newWaypoint.type);

  return pointTypeOffer.offers.map((offer) => (
    `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal" ${newWaypoint.offers.includes(offer.id) ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-meal-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`
  )).join('');
}

function createTypeListTemplate(types, newWaypoint) {
  return types.map((type) => (
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${newWaypoint.type === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`
  )).join('');
}

function createCityListTemplate(availableCities) {
  return availableCities.map((city) => (
    `<option value="${city}"></option>`
  )).join('');
}

function createDestinationTemplate(newWaypoint, newDestinations) {
  const pointDestination = newDestinations.find((destinationToFind) => newWaypoint.destination === destinationToFind.id);
  if (pointDestination.description && pointDestination.pictures) {
    return `<section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${pointDestination.description}</p>

              <div class="event__photos-container">
                <div class="event__photos-tape">
                  ${pointDestination.pictures.map((i) => (`<img class="event__photo" src="${i.src}" alt="${i.description}">`))}
                </div>
              </div>
            </section>`;
  } else {
    return '';
  }
}

function createNewPointTemplate(newWaypoint, types, availableCities, offers, newDestinations) {
  const typeList = createTypeListTemplate(types, newWaypoint);
  const cityList = createCityListTemplate(availableCities);
  const offerList = createOfferListTemplate(offers, newWaypoint);
  const dateFrom = humanizePointDateAndTime(newWaypoint.date_from);
  const dateTo = humanizePointDateAndTime(newWaypoint.date_to);
  const descriptionDest = createDestinationTemplate(newWaypoint, newDestinations);
  const pointDestination = newDestinations.find((destinationToFind) => newWaypoint.destination === destinationToFind.id);

  return (
    `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${newWaypoint.type}.png" alt="Event type icon">
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
            ${newWaypoint.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination.name}" list="destination-list-2">
          <datalist id="destination-list-2">
          ${cityList}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${newWaypoint.base_price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offerList}
          </div>
        </section>

        ${newWaypoint.destination ? descriptionDest : ''}
      </section>
    </form>`
  );
}

export default class NewPointView extends AbstractStatefulView {
  #newDestinations = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({ newWaypoint = BLANK_POINT, types = pointTypes, availableCities = cities, offers = offersByType, newDestinations = destinations }) {
    super();
    this._setState(NewPointView.parsePointToState({ newWaypoint, types, availableCities, offers, newDestinations }));

    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element.querySelector('.event__type-list').addEventListener('click', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationChangeHandler);

    this.#setDatepicker();
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement(
      this._state.newWaypoint.type = evt.target.textContent,
      this._state.newWaypoint.offers = []
    );
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    let cityId = '';

    for (let i = 0; i < this.#newDestinations.length; i++) {
      if (this._state.newDestinations[i].name === evt.target.value) {
        cityId = this._state.newDestinations[i].id;
        this.updateElement(
          this._state.newWaypoint.destination = cityId
        );
      } else {
        cityId = '';
      }
    }
  };

  get template() {
    return createNewPointTemplate(this._state);
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
      this._state.newWaypoint['date_from'] = dateFrom
    );
  };

  #dateToChangeHandler = (dateTo) => {
    this.updateElement(
      this._state.newWaypoint['date_to'] = dateTo
    );
  };


  #setDatepicker() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.newWaypoint['date_from'],
        onChange: this.#dateFromChangeHandler,
      },
    );


    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.newWaypoint['date_to'],
        onChange: this.#dateToChangeHandler,
      },
    );
  }
}

