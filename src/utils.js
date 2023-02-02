import dayjs from 'dayjs';

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

// function updateItem(items, update) {
//   return items.splice(items.findIndex((item) => item.id === update.id), 1, update);
// }

function sortDayDesc(waypointA, waypointB) {
  const dateA = new Date(waypointA.date_from);
  const dateB = new Date(waypointB.date_from);
  return dateA - dateB;
}

function sortTimeDesc(waypointA, waypointB) {
  const durationA = new Date(waypointA.date_to) - new Date(waypointA.date_from);
  const durationB = new Date(waypointB.date_to) - new Date(waypointB.date_from);
  return durationB - durationA;
}

function sortPriceDesc(waypointA, waypointB) {
  return waypointB.base_price - waypointA.base_price;
}

function isDatesEqual(dateWaypoint, dateUpdate) {
  return dateWaypoint === dateUpdate ? true : (dateWaypoint === null && dateUpdate === null);
}

function isPriceEqual(priceWaypoint, priceUpdate) {
  return priceWaypoint === priceUpdate ? true : (priceWaypoint === null && priceUpdate === null);
}

function isDurationEqual(waypoint, update) {
  const durationWaypoint = new Date(waypoint.date_to) - new Date(waypoint.date_from);
  const durationUpdate = new Date(update.date_to) - new Date(update.date_from);
  return durationWaypoint === durationUpdate ? true : (durationWaypoint === null && durationUpdate === null);
}

export { getRandomArrayElement, getRandomPositiveInteger, humanizePointDueDate, humanizePointTime, calculateDuration, humanizePointDateAndTime, sortDayDesc, sortTimeDesc, sortPriceDesc, isDatesEqual, isPriceEqual, isDurationEqual };
