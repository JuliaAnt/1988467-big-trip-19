import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #points = [];
  #destinations = [];
  #offersByType = [];
  #waypointsApiService = null;
  #isLoadingError = false;
  #handleNewPointFormClose = null;

  constructor({ waypointsApiService, onNewPointDestroy }) {
    super();
    this.#waypointsApiService = waypointsApiService;
    this.#handleNewPointFormClose = onNewPointDestroy;
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
    const cities = new Set(this.#destinations.map(({ name }) => name));
    return Array.from(cities);
  }

  get pointTypes() {
    const pointTypes = new Set(this.#offersByType.map(({ type }) => type));
    return Array.from(pointTypes);
  }

  get loadingError() {
    return this.#isLoadingError;
  }

  async init() {
    try {
      const waypoints = await this.#waypointsApiService.waypoints;

      this.#points = waypoints.map(this.#adaptToClient);
    } catch {
      this.#points = [];
    }

    try {
      const destinations = await this.#waypointsApiService.destinations;
      const offersByType = await this.#waypointsApiService.offersByType;

      this.#destinations = destinations;
      this.#offersByType = offersByType;
    } catch {
      this.#isLoadingError = true;
      this.#handleNewPointFormClose();
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

  async addPoint(updateType, update) {
    try {
      const response = await this.#waypointsApiService.addWaypoint(update);
      const newWaypoint = this.#adaptToClient(response);

      this.#points.push(newWaypoint);

      this._notify(updateType, newWaypoint);
    } catch {
      throw new Error('Can\'t add waypoint');
    }
  }

  async deletePoint(updateType, update) {
    try {
      if (!await this.#waypointsApiService.deleteWaypoint(update)) {
        throw new Error('Can\'t delete waypoint');
      }

      const filteredPoints = this.#points.filter(({ id }) => id !== update.waypoint.id);

      if (this.#points.length === filteredPoints.length) {
        throw new Error('Can\'t delete unexisting point');
      }

      this.#points = filteredPoints;

      this._notify(updateType);
    } catch (err) {
      throw new Error(err.message);
    }
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
