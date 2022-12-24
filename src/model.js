import { getRandomElement } from './mock/mock-data.js';

const NUMBER_OF_EVENTS = 3;

export default class PointsModel {
  points = Array.from({ length: NUMBER_OF_EVENTS }, getRandomElement);

  getPoints() {
    return this.points;
  }
}
