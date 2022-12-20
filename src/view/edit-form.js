import { createElement } from '../render.js';
import { humanizePointDateAndTime } from '../utils.js';
import { pointTypes, cities, offersByType, getRandomElement } from '../mock/mock-data.js';

const editPoint = getRandomElement();

function createOfferListTemplate(offers, newWaypoint) {
  const pointTypeOffer = offers.find((offerToFind) => offerToFind.type === newWaypoint.type);

  return pointTypeOffer.offers.map((offer) => {
    if (newWaypoint.offers.includes(offer.id)) {
      return (
        `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal" checked>
        <label class="event__offer-label" for="event-offer-meal-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`
      );
    } else {
      return (
        `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">
        <label class="event__offer-label" for="event-offer-meal-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`
      );
    }
  }).join('');
}

function createTypeListTemplate(types, newWaypoint) {
  return types.map((type) => {
    if (newWaypoint.type === type) {
      return (
        `<div class="event__type-item">
          <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" checked>
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
        </div>`
      );
    } else {
      return (
        `<div class="event__type-item">
          <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
        </div>`
      );
    }
  }).join('');
}

function createCityListTemplate(availableCities) {
  return availableCities.map((city) => (
    `<option value="${city}"></option>`
  )).join('');
}

function createEditFormsTemplate(newWaypoint, types, availableCities, offers) {
  const typeList = createTypeListTemplate(types, newWaypoint);
  const cityList = createCityListTemplate(availableCities);
  const offerList = createOfferListTemplate(offers, newWaypoint);
  const dateFrom = humanizePointDateAndTime(newWaypoint.date_from);
  const dateTo = humanizePointDateAndTime(newWaypoint.date_to);

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${newWaypoint.destination.name}" list="destination-list-2">
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

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${newWaypoint.destination.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              <img class="event__photo" src="${newWaypoint.destination.pictures[0].src}" alt="${newWaypoint.destination.pictures[0].description}">
              <img class="event__photo" src="${newWaypoint.destination.pictures[1].src}" alt="${newWaypoint.destination.pictures[1].description}">
              <img class="event__photo" src="${newWaypoint.destination.pictures[2].src}" alt="${newWaypoint.destination.pictures[2].description}">
              <img class="event__photo" src="${newWaypoint.destination.pictures[3].src}" alt="${newWaypoint.destination.pictures[3].description}">
              <img class="event__photo" src="${newWaypoint.destination.pictures[4].src}" alt="${newWaypoint.destination.pictures[4].description}">
            </div>
          </div>
        </section>
      </section>
    </form>`
  );
}

export default class EditFormView {
  constructor(newWaypoint, types, availableCities, offers) {
    this.newWaypoint = newWaypoint || editPoint;
    this.types = types || pointTypes;
    this.availableCities = availableCities || cities;
    this.offers = offers || offersByType;
  }

  getTemplate() {
    return createEditFormsTemplate(this.newWaypoint, this.types, this.availableCities, this.offers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
