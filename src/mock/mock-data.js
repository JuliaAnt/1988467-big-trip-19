import { getRandomArrayElement, getRandomPositiveInteger } from '../utils.js';

const COUNT_OF_PHOTO = 100;

const descriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const pointTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const offersByType = [
  {
    'type': 'taxi',
    'offers': [
      {
        'id': 1,
        'title': 'Order Uber',
        'price': 20,
      },
      {
        'id': 2,
        'title': 'Upgrade',
        'price': 20,
      },
      {
        'id': 3,
        'title': 'Upgrade',
        'price': 30,
      }
    ]
  },
  {
    'type': 'flight',
    'offers': [
      {
        'id': 1,
        'title': 'Add luggage',
        'price': 30,
      },
      {
        'id': 2,
        'title': 'Switch to comfort',
        'price': 100,
      },
      {
        'id': 3,
        'title': 'Choose seats',
        'price': 20,
      },
    ]
  },
  {
    'type': 'drive',
    'offers': [
      {
        'id': 1,
        'title': 'Rent a car',
        'price': 200,
      },
      {
        'id': 2,
        'title': 'Upgrade',
        'price': 20,
      },
      {
        'id': 3,
        'title': 'Upgrade',
        'price': 30,
      },
    ]
  },
  {
    'type': 'check-in',
    'offers': [
      {
        'id': 1,
        'title': 'Add breakfast',
        'price': 50,
      },
      {
        'id': 2,
        'title': 'Upgrade',
        'price': 20,
      },
      {
        'id': 3,
        'title': 'Upgrade',
        'price': 40,
      },
    ]
  },
  {
    'type': 'sightseeing',
    'offers': [
      {
        'id': 1,
        'title': 'Book tickets',
        'price': 40,
      },
      {
        'id': 2,
        'title': 'Lunch in city',
        'price': 30,
      },
      {
        'id': 3,
        'title': 'Upgrade',
        'price': 40,
      },
    ]
  },
  {
    'type': 'bus',
    'offers': [
      {
        'id': 1,
        'title': 'Add luggage',
        'price': 10,
      },
      {
        'id': 2,
        'title': 'Choose seats',
        'price': 20,
      },
      {
        'id': 3,
        'title': 'Upgrade',
        'price': 30,
      },
    ]
  },
  {
    'type': 'train',
    'offers': [
      {
        'id': 1,
        'title': 'Add luggage',
        'price': 20,
      },
      {
        'id': 2,
        'title': 'Choose seats',
        'price': 20,
      },
      {
        'id': 3,
        'title': 'Upgrade',
        'price': 30,
      },
    ]
  },
  {
    'type': 'ship',
    'offers': [
      {
        'id': 1,
        'title': 'Switch to comfort',
        'price': 50,
      },
      {
        'id': 2,
        'title': 'Choose seats',
        'price': 20,
      },
      {
        'id': 3,
        'title': 'Upgrade',
        'price': 100,
      },
    ]
  },
  {
    'type': 'restaurant',
    'offers': [
      {
        'id': 1,
        'title': 'Switch to private hall',
        'price': 20,
      },
      {
        'id': 2,
        'title': 'Upgrade',
        'price': 20,
      },
      {
        'id': 3,
        'title': 'Upgrade',
        'price': 50,
      },
    ]
  },
];

const cities = ['Amsterdam', 'Milan', 'Seville', 'Budapest', 'Edinburgh', 'Vienna'];

const destinations = [
  {
    'id': 1,
    'description': getRandomArrayElement(descriptions),
    'name': getRandomArrayElement(cities),
    'pictures': [
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
    ]
  },
  {
    'id': 2,
    'description': getRandomArrayElement(descriptions),
    'name': getRandomArrayElement(cities),
    'pictures': [
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
    ]
  },
  {
    'id': 3,
    'description': getRandomArrayElement(descriptions),
    'name': getRandomArrayElement(cities),
    'pictures': [
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
    ]
  },
  {
    'id': 4,
    'description': getRandomArrayElement(descriptions),
    'name': getRandomArrayElement(cities),
    'pictures': [
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
    ]
  },
  {
    'id': 5,
    'description': getRandomArrayElement(descriptions),
    'name': getRandomArrayElement(cities),
    'pictures': [
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(0, COUNT_OF_PHOTO)}`,
        'description': getRandomArrayElement(cities),
      },
    ]
  },
];

const mockPoints = [
  {
    'base_price': getRandomPositiveInteger(10, 1500),
    'date_from': '2019-07-10T22:55:56.845Z',
    'date_to': '2019-07-11T11:22:13.375Z',
    get destination() {
      return destinations[this.id - 1];
    },
    'id': '1',
    'is_favorite': true,
    'offers': [3],
    'type': getRandomArrayElement(pointTypes),
  },
  {
    'base_price': getRandomPositiveInteger(10, 1500),
    'date_from': '2019-08-10T22:55:56.845Z',
    'date_to': '2019-08-11T11:22:13.375Z',
    get destination() {
      return destinations[this.id - 1];
    },
    'id': '2',
    'is_favorite': false,
    'offers': [1],
    'type': getRandomArrayElement(pointTypes),
  },
  {
    'base_price': getRandomPositiveInteger(10, 1500),
    'date_from': '2019-07-10T09:15:56.845Z',
    'date_to': '2019-07-10T12:22:13.375Z',
    get destination() {
      return destinations[this.id - 1];
    },
    'id': '3',
    'is_favorite': false,
    'offers': [2],
    'type': getRandomArrayElement(pointTypes),
  },
  {
    'base_price': getRandomPositiveInteger(10, 1500),
    'date_from': '2023-01-05T06:40:56.845Z',
    'date_to': '2023-01-05T09:45:13.375Z',
    get destination() {
      return destinations[this.id - 1];
    },
    'id': '4',
    'is_favorite': false,
    'offers': [1],
    'type': getRandomArrayElement(pointTypes),
  },
  {
    'base_price': getRandomPositiveInteger(10, 1500),
    'date_from': '2023-01-26T13:20:15.845Z',
    'date_to': '2023-01-26T17:25:13.375Z',
    get destination() {
      return destinations[this.id - 1];
    },
    'id': '5',
    'is_favorite': false,
    'offers': [2],
    'type': getRandomArrayElement(pointTypes),
  }
];

const getRandomElement = () => getRandomArrayElement(mockPoints);

export { getRandomElement, offersByType, pointTypes, destinations, cities };


