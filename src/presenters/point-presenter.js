import { render, replace, remove } from '../framework/render.js';
import EditFormView from '../view/edit-form.js';
import WaypointView from '../view/waypoint.js';
import { UserAction, UpdateType } from '../const.js';
import { isDatesEqual, isPriceEqual, isDurationEqual } from '../utils.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #pointListContainer = null;
  #pointListItem = null;
  #pointEditItem = null;
  #props = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ pointListContainer, onDataChange, onModeChange }) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
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
      onEditSubmit: this.#handleEditSubmit,
      onEditReset: this.#handleEditReset,
      onDeleteClick: this.#handleDeleteClick
    });

    if (prevPointListItem === null || prevPointEditItem === null) {
      return render(this.#pointListItem, this.#pointListContainer);
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointListItem, prevPointListItem);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditItem, prevPointEditItem);
    }

    remove(prevPointListItem);
    remove(prevPointEditItem);
  }

  destroy() {
    remove(this.#pointListItem);
    remove(this.#pointEditItem);
  }

  setDefaultMode() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditItem.reset(this.#props);
      this.#replaceEditToWaypoint();
    }
  }

  get props() {
    return this.#props;
  }


  #replaceWaypointToEdit = () => {
    replace(this.#pointEditItem, this.#pointListItem);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceEditToWaypoint = () => {
    replace(this.#pointListItem, this.#pointEditItem);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#pointEditItem.reset(this.#props);
      this.#replaceEditToWaypoint();
    }
  };

  #handleEditClick = () => {
    this.#replaceWaypointToEdit();
  };

  #handleFavoriteClick = (waypoint) => {
    const updatedPoint = { ...waypoint, ['is_favorite']: !waypoint.is_favorite };

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      updatedPoint
    );
  };

  #handleEditSubmit = (update) => {
    const isMinorUpdate = !isDatesEqual(this.#props.waypoint['date_from'], update['date_from']) ||
      !isPriceEqual(this.#props.waypoint['base_price'], update['base_price']) ||
      !isDurationEqual(this.#props.waypoint, update);

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update
    );

    this.#replaceEditToWaypoint();
  };

  #handleEditReset = () => {
    this.#pointEditItem.reset(this.#props);
    this.#replaceEditToWaypoint();
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}

