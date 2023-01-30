import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizePointDateAndTime } from '../utils.js';

function createOfferListTemplate(offers, waypoint) {
  const pointTypeOffer = offers.find((offerToFind) => offerToFind.type === waypoint.type);

  return pointTypeOffer.offers.map((offer) => (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal" ${waypoint.offers.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-meal-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  )).join('');
}

function createTypeListTemplate(types, waypoint) {
  return types.map((type) => (
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${waypoint.type === type ? 'checked' : ''}>
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
  const { waypoint, types, availableCities, offers, destinations } = data;
  const typeList = createTypeListTemplate(types, waypoint);
  const cityList = createCityListTemplate(availableCities);
  const offerList = createOfferListTemplate(offers, waypoint);
  const dateFrom = humanizePointDateAndTime(waypoint.date_from);
  const dateTo = humanizePointDateAndTime(waypoint.date_to);
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
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${waypoint.base_price}">
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

        ${waypoint.destination ? descriptionDest : ''}
      </section>
    </form>`
  );
}

export default class EditFormView extends AbstractStatefulView {
  #handleEditSubmit = null;
  #handleEditReset = null;

  constructor({ waypoint, types, availableCities, offers, destinations, onEditSubmit, onEditReset }) {
    super();
    this._setState(EditFormView.parsePointToState({ waypoint, types, availableCities, offers, destinations }));
    this.#handleEditSubmit = onEditSubmit;
    this.#handleEditReset = onEditReset;

    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#editSubmitHandler);
    this.element.addEventListener('reset', this.#editResetHandler);

    this.element.querySelector('.event__type-list').addEventListener('click', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationChangeHandler);
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

    this._state.destinations.find((destinationItem) => destinationItem.name === evt.target.value ?
      this.updateElement(
        this._state.waypoint.destination = destinationItem.id
      ) : '');
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
    this.#handleEditSubmit(EditFormView.parseStateToPoint(this._state));
  };

  #editResetHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditReset(EditFormView.parseStateToPoint(this._state));
  };

  static parsePointToState(waypoint) {
    return { ...waypoint };
  }

  static parseStateToPoint(state) {
    return { ...state };
  }

}
