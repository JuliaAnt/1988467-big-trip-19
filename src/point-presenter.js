import { render, replace, remove } from './framework/render.js';
import EditFormView from './view/edit-form.js';
import WaypointView from './view/waypoint.js';

export default class PointPresenter {
  #pointListContainer = null;
  #pointListItem = null;
  #pointEditItem = null;
  #props = null;
  #handleDataChange = null;

  constructor({ pointListContainer, onDataChange }) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
  }

  init(props) {
    this.#props = props;

    const prevPointListItem = this.#pointListItem;
    const prevPointEditItem = this.#pointEditItem;

    this.#pointListItem = new WaypointView({
      ...this.#props,
      onClick: () => {
        this.#handleEditClick();
      },
      onFavoriteClick: (waypoint) => {
        this.#handleFavoriteClick(waypoint);
      }
    });

    this.#pointEditItem = new EditFormView({
      ...this.#props,
      onEditSubmit: () => {
        this.#handleEditSubmit();
      },
      onEditReset: () => {
        this.#handleEditReset();
      }
    });

    if (prevPointListItem === null || prevPointEditItem === null) {
      render(this.#pointListItem, this.#pointListContainer);
      return;
    }

    if (this.#pointListContainer.contains(prevPointListItem.element)) {
      replace(this.#pointListItem, prevPointListItem);
    }

    if (this.#pointListContainer.contains(prevPointEditItem.element)) {
      replace(this.#pointEditItem, prevPointEditItem);
    }

    remove(prevPointListItem);
    remove(prevPointEditItem);
  }

  destroy() {
    remove(this.#pointListItem);
    remove(this.#pointEditItem);
  }

  get props() { return this.#props; }


  #replaceWaypointToEdit() {
    replace(this.#pointEditItem, this.#pointListItem);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceEditToWaypoint() {
    replace(this.#pointListItem, this.#pointEditItem);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceEditToWaypoint();
    }
  };

  #handleEditClick = () => {
    this.#replaceWaypointToEdit();
  };

  #handleFavoriteClick = (waypoint) => {
    const updatedPoint = { ...waypoint, ['is_favorite']: !waypoint.is_favorite };
    this.#handleDataChange(updatedPoint);
  };

  #handleEditSubmit = (props) => {
    this.#handleDataChange(props);
    this.#replaceEditToWaypoint();
  };

  #handleEditReset = () => {
    this.#replaceEditToWaypoint();
  };
}
