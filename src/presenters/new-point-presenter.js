import { remove, render, RenderPosition } from '../framework/render.js';
import NewPointView from '../view/new-point.js';
import { UserAction, UpdateType } from '../const.js';

export default class NewPointPresenter {
  #pointsCount = null;
  #eventList = null;
  #eventItem = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #newPointProps = null;

  #newEventComponent = null;

  constructor({ pointsCount, eventList, eventItem, onDataChange, onDestroy }) {
    this.#pointsCount = pointsCount;
    this.#eventList = eventList;
    this.#eventItem = eventItem;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init(newPointProps) {
    this.#newPointProps = newPointProps;
    if (this.#newEventComponent !== null) {
      return;
    }

    this.#newEventComponent = new NewPointView({
      ...this.#newPointProps,
      onNewEventSubmit: this.#handleFormSubmit,
      onNewEventReset: this.#handleDeleteClick
    });

    render(this.#eventItem, this.#eventList.element, RenderPosition.AFTERBEGIN);
    render(this.#newEventComponent, this.#eventItem.element, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#newEventComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#eventItem);
    remove(this.#newEventComponent);
    this.#newEventComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#newEventComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#newEventComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#newEventComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );

    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();

    if (this.#pointsCount === 0) {
      remove(this.#eventList);
    }
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();

      if (this.#pointsCount === 0) {
        remove(this.#eventList);
      }
    }
  };
}
