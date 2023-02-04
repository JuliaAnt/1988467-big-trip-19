import AbstractView from '../framework/view/abstract-view.js';
import { humanizePointDueDate, humanizePointTime, calculateDuration } from '../utils.js';

function createWaypointOffersTemplate(offers, waypoint) {
  const pointTypeOffer = offers.find((offerToFind) => offerToFind.type === waypoint.type);

  return pointTypeOffer.offers.map((offer) => (
    waypoint.offers.includes(offer.id) ? (
      `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`
    ) : '')).join('');
}

function createWaypointTemplate(offers, waypoint, destinations) {
  const dateFrom = humanizePointDueDate(waypoint.dateFrom);
  const timeTo = humanizePointTime(waypoint.dateTo);
  const timeFrom = humanizePointTime(waypoint.dateFrom);
  const duration = calculateDuration(waypoint.dateFrom, waypoint.dateTo);
  const favoriteClassName = waypoint.isFavorite ? 'event__favorite-btn--active' : '';
  const offersTemplate = createWaypointOffersTemplate(offers, waypoint);

  const pointDestination = destinations.find((destinationToFind) => waypoint.destination === destinationToFind.id);


  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${waypoint.dateFrom}">${dateFrom}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${waypoint.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${waypoint.type} ${pointDestination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${timeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${timeTo}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${waypoint.basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersTemplate}
        </ul>
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class WaypointView extends AbstractView {
  #offers = null;
  #waypoint = null;
  #handleClick = null;
  #handleFavoriteClick = null;
  #destinations = null;

  constructor({ offers, waypoint, destinations, onClick, onFavoriteClick }) {
    super();
    this.#offers = offers;
    this.#waypoint = waypoint;
    this.#destinations = destinations;
    this.#handleClick = onClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createWaypointTemplate(this.#offers, this.#waypoint, this.#destinations);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick(this.#waypoint);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
