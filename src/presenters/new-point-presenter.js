import { remove, render, RenderPosition } from '../framework/render.js';
import NewPointView from '../view/new-point.js';
import { UserAction, UpdateType } from '../const.js';

export default class NewPointPresenter {
  #eventItem = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #handleNewEventAdd = null;
  #newPointProps = null;

  #newEventComponent = null;

  constructor({ eventItem, onDataChange, onDestroy, onNewEventAdd }) {
    this.#eventItem = eventItem;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#handleNewEventAdd = onNewEventAdd;
  }

  init(newPointProps) {
    this.#newPointProps = newPointProps;
    if (this.#newEventComponent !== null) {
      return;
    }

    this.#newEventComponent = new NewPointView({
      ...this.#newPointProps,
      onNewEventAdd: this.#handleNewEventAdd,
      onNewEventSubmit: this.#handleFormSubmit,
      onNewEventReset: this.#handleDeleteClick
    });

    render(this.#newEventComponent, this.#eventItem.element, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#newEventComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#newEventComponent);
    this.#newEventComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      { ...point },
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
