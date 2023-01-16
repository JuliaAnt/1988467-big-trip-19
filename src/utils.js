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

function updateItem(items, update) {
  return items.splice(items.findIndex((item) => item.id === update.id), 1, update);
}

function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
}

function sortDayDesc(waypointA, waypointB) {
  const weight = getWeightForNullDate(waypointA.date_from, waypointB.date_from);

  return weight ?? dayjs(waypointA.date_from).diff(dayjs(waypointB.date_from));
}

function sortTimeDesc(waypointA, waypointB) {
  const durationA = dayjs(waypointA.date_to).diff(waypointA.date_from);
  const durationB = dayjs(waypointB.date_to).diff(waypointB.date_from);
  return durationB - durationA;
}

function sortPriceDesc(waypointA, waypointB) {
  return waypointB.base_price - waypointA.base_price;
}

export { getRandomArrayElement, updateItem, getRandomPositiveInteger, humanizePointDueDate, humanizePointTime, calculateDuration, humanizePointDateAndTime, sortDayDesc, sortTimeDesc, sortPriceDesc };
