import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #points = [];
  #destinations = [];
  #offersByType = [];
  #waypointsApiService = null;

  constructor({ waypointsApiService }) {
    super();
    this.#waypointsApiService = waypointsApiService;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offersByType() {
    return this.#offersByType;
  }

  get cities() {
    const cities = new Set();
    this.#destinations.map((destination) => {
      cities.add(destination.name);
    });
    return Array.from(cities);
  }

  get pointTypes() {
    const pointTypes = new Set();
    this.#points.map((point) => {
      pointTypes.add(point.type);
    });
    return Array.from(pointTypes);
  }

  async init() {
    try {
      const waypoints = await this.#waypointsApiService.waypoints;
      const destinations = await this.#waypointsApiService.destinations;
      const offersByType = await this.#waypointsApiService.offersByType;

      this.#points = waypoints.map(this.#adaptToClient);
      this.#destinations = destinations;
      this.#offersByType = offersByType;
    } catch {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#waypointsApiService.updateWaypoint(update);
      const updateWaypoint = this.#adaptToClient(response);
      this.#points.splice(index, 1, updateWaypoint);

      this._notify(updateType, update);
    } catch {
      throw new Error('Can\'t update waypoint');
    }
  }

  addPoint(updateType, update) {
    this.#points.push(update);

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const filteredPoints = this.#points.filter((point) => point.id !== update.waypoint.id);

    if (this.#points.length === filteredPoints.length) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = filteredPoints;

    this._notify(updateType);
  }

  #adaptToClient = (waypoint) => {
    const adaptedWaypoint = {
      ...waypoint,
      basePrice: waypoint['base_price'],
      dateFrom: waypoint['date_from'],
      dateTo: waypoint['date_to'],
      isFavorite: waypoint['is_favorite'],
    };

    delete adaptedWaypoint['base_price'];
    delete adaptedWaypoint['date_from'];
    delete adaptedWaypoint['date_to'];
    delete adaptedWaypoint['is_favorite'];

    return adaptedWaypoint;
  };
}
