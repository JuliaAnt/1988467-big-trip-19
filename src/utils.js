import dayjs from 'dayjs';
import { FilterType } from './const';

const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';
const DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';

function humanizePointDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}

function humanizePointTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(TIME_FORMAT) : '';
}

function humanizePointDateAndTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_TIME_FORMAT) : '';
}

function calculateDuration(dateFrom, dateTo) {
  const duration = dayjs(dateTo).diff(dateFrom, 'minute');
  let humanizeDuration = 0;
  if (duration < 60) {
    humanizeDuration = `${Math.floor(duration)}M`;
  } else if (duration >= 60 && duration < 1440) {
    humanizeDuration = `${Math.floor(duration / 60)}H ${duration % 60}M`;
  } else if (duration >= 1440) {
    humanizeDuration = `${Math.floor(duration / 1440)}D ${Math.floor((duration % 1440) / 60)}H ${duration % 60}M`;
  }
  return humanizeDuration;
}

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomPositiveInteger = (a, b) => {
  if (a < 0 || b < 0) {
    return NaN;
  }

  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function sortDayDesc(waypointA, waypointB) {
  const dateA = new Date(waypointA.dateFrom);
  const dateB = new Date(waypointB.dateFrom);
  return dateA - dateB;
}

function sortTimeDesc(waypointA, waypointB) {
  const durationA = new Date(waypointA.dateTo) - new Date(waypointA.dateFrom);
  const durationB = new Date(waypointB.dateTo) - new Date(waypointB.dateFrom);
  return durationB - durationA;
}

function sortPriceDesc(waypointA, waypointB) {
  return waypointB.basePrice - waypointA.basePrice;
}

function isDatesEqual(dateWaypoint, dateUpdate) {
  return dateWaypoint === dateUpdate ? true : (dateWaypoint === null && dateUpdate === null);
}

function isPriceEqual(priceWaypoint, priceUpdate) {
  return priceWaypoint === priceUpdate ? true : (priceWaypoint === null && priceUpdate === null);
}

function isDurationEqual(waypoint, update) {
  const durationWaypoint = new Date(waypoint.dateTo) - new Date(waypoint.dateFrom);
  const durationUpdate = new Date(update.dateTo) - new Date(update.dateFrom);
  return durationWaypoint === durationUpdate ? true : (durationWaypoint === null && durationUpdate === null);
}

const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => !point.isArchive),
  [FilterType.FUTURE]: (points) => points.filter((point) => Date.parse(point.dateFrom) > Date.now()),
  [FilterType.PRESENT]: (points) => points.filter((point) => Date.parse(point.dateFrom) <= Date.now() && Date.parse(point.dateTo) >= Date.now()),
  [FilterType.PAST]: (points) => points.filter((point) => Date.parse(point.dateTo) < Date.now())
};

export { getRandomArrayElement, getRandomPositiveInteger, humanizePointDueDate, humanizePointTime, calculateDuration, humanizePointDateAndTime, sortDayDesc, sortTimeDesc, sortPriceDesc, isDatesEqual, isPriceEqual, isDurationEqual, filter };
