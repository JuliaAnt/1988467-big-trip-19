import { getRandomElement } from '../mock/mock-data.js';
import Observable from '../framework/observable.js';


const NUMBER_OF_EVENTS = 3;

export default class PointsModel extends Observable {
  #points = [];

  get points() {
    const uniqueMap = {};

    for (let i = 0; this.#points.length < NUMBER_OF_EVENTS; i++) {
      const randomEl = getRandomElement();
      if (!uniqueMap[randomEl.id]) {
        uniqueMap[randomEl.id] = randomEl;
        this.#points.push(randomEl);
      }
    }

    return this.#points;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.waypoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
