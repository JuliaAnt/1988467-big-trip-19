import { render, replace, remove } from '../framework/render.js';
import FiltersView from '../view/filters.js';
import { UpdateType, FilterType } from '../const.js';
import { filter } from '../utils.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #model = null;

  #filterComponent = null;

  constructor({ filterContainer, filterModel, model }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#model = model;

    this.#model.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const waypoints = this.#model.points;

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'everything',
        count: filter[FilterType.EVERYTHING](waypoints).length,
      },
      {
        type: FilterType.FUTURE,
        name: 'future',
        count: filter[FilterType.FUTURE](waypoints).length,
      },
      {
        type: FilterType.PRESENT,
        name: 'present',
        count: filter[FilterType.PRESENT](waypoints).length,
      },
      {
        type: FilterType.PAST,
        name: 'past',
        count: filter[FilterType.PAST](waypoints).length,
      }
    ];
  }

  init() {
    const prevFilterComponent = this.#filterComponent;
    const filters = this.filters;

    this.#filterComponent = new FiltersView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  destroy() {
    remove(this.#filterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
