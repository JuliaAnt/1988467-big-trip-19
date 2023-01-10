import { render, replace, remove } from './framework/render.js';
import EditFormView from './view/edit-form.js';
import WaypointView from './view/waypoint.js';

export default class PointPresenter {
  #pointListContainer = null;
  #pointListItem = null;
  #pointEditItem = null;
  #props = null;

  constructor({ pointListContainer }) {
    this.#pointListContainer = pointListContainer;
  }

  init(props) {
    this.#props = props;

    const prevPointListItem = this.#pointListItem;
    const prevPointEditItem = this.#pointEditItem;

    this.#pointListItem = new WaypointView({
      ...this.#props,
      onClick: () => {
        this.#handleEditClick();
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


  #replaceWaypointToEdit() {
    replace(this.#pointEditItem, this.#pointListItem);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceEditToWaypoint() {
    replace(this.#pointListItem, this.#pointEditItem);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceEditToWaypoint.call(this);
    }
  }

  #handleEditClick = () => {
    this.#replaceWaypointToEdit();
  };

  #handleEditSubmit = () => {
    this.#replaceEditToWaypoint();
  };

  #handleEditReset = () => {
    this.#replaceEditToWaypoint();
  };
}
