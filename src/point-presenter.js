import { render, replace } from './framework/render.js';
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

    render(this.#pointListItem, this.#pointListContainer);
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
