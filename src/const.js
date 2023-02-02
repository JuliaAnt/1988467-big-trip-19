const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const SortType = {
  DEFAULT: 'default',
  PRICE_DESC: 'price-desc',
  TIME_DESC: 'time-desc',
};

const SortNames = ['day', 'event', 'time', 'price', 'offer'];

const TYPE_SORT_MAP = {
  day: SortType.DEFAULT,
  time: SortType.TIME_DESC,
  price: SortType.PRICE_DESC
};


export {SortType, SortNames, TYPE_SORT_MAP, UserAction, UpdateType};

