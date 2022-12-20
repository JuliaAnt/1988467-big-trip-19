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

export { getRandomArrayElement, getRandomPositiveInteger, humanizePointDueDate, humanizePointTime, calculateDuration, humanizePointDateAndTime };
