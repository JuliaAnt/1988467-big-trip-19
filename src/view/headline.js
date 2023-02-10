import AbstractView from '../framework/view/abstract-view.js';
import { humanizePointDueDate, sortDayDesc } from '../utils.js';

const COUNT_OF_CITIES_IN_HEADLINE = 3;

function createHeadlineCitiesTemplate(sortedPoints, destinations) {
  const sortedCities = [];
  const modifiedPoints = sortedPoints.slice();

  if (modifiedPoints.length > COUNT_OF_CITIES_IN_HEADLINE) {
    modifiedPoints.splice(1, sortedPoints.length - 2);
  }

  modifiedPoints.map((point) => {
    sortedCities.push(destinations.find((destinationToFind) => destinationToFind.id === point.destination).name);
  });

  return (
    `<h1 class="trip-info__title">${sortedCities.length < COUNT_OF_CITIES_IN_HEADLINE ? sortedCities.join('&nbsp;&mdash;&nbsp;...&nbsp;&mdash;&nbsp;') : sortedCities.join('&nbsp;&mdash;&nbsp;')}</h1>`
  );
}

function createHeadlineAmountTemplate(sortedPoints, offers) {
  let totalAmount = 0;
  sortedPoints.map((point) => {
    totalAmount = totalAmount + point.basePrice;
    offers.find((offerToFind) => point.type === offerToFind.type).offers.map((offer) => {
      if (point.offers.includes(offer.id)) {
        totalAmount += offer.price;
      }
    });
  });
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalAmount}</span>
    </p>`
  );
}

function createHeadlineTemplate(waypoints, destinations, offers) {
  const sortedPoints = waypoints.sort(sortDayDesc);
  const dateFrom = humanizePointDueDate(sortedPoints[0].dateFrom);
  const dateTo = humanizePointDueDate(sortedPoints[sortedPoints.length - 1].dateTo);
  const cityList = createHeadlineCitiesTemplate(sortedPoints, destinations);
  const totalAmountItem = createHeadlineAmountTemplate(sortedPoints, offers);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        ${cityList}

        <p class="trip-info__dates">${dateFrom}&nbsp;&mdash;&nbsp;${dateTo}</p>
      </div>

      ${totalAmountItem}
    </section>`
  );
}

export default class HeadlineView extends AbstractView {
  #waypoints = null;
  #destinations = null;
  #offers = null;

  constructor({ waypoints, destinations, offers }) {
    super();
    this.#waypoints = waypoints;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createHeadlineTemplate(this.#waypoints, this.#destinations, this.#offers);
  }
}
