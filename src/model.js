import { getRandomElement } from './mock/mock-data.js';

const NUMBER_OF_EVENTS = 3;

export default class PointsModel {
  // #points = Array.from({ length: NUMBER_OF_EVENTS }, getRandomElement);
  #points = [];

  get points() {
    const uniqueMap = {};
    while (this.#points.length < NUMBER_OF_EVENTS) {
      const randomEl = getRandomElement();
      if (!uniqueMap[randomEl.id]) {
        uniqueMap[randomEl.id] = randomEl;
        this.#points.push(randomEl);
      }
    }
    return this.#points;
  }
}
