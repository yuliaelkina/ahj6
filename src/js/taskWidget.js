/* eslint-disable  consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable  no-param-reassign */

export default class TaskWidget {
  constructor(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    this._element = element;
    this.buttons = [...document.querySelectorAll('.task-widget__button')];
    this.items = [...this._element.querySelectorAll('.task-widget__item')];
  }

  init() {
    this.buttons.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.addNewCard(el);
      });
    });
    this.items.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.style.cursor = 'pointer';
        TaskWidget.addDeleteButton(el);
      });
      el.addEventListener('mouseleave', () => {
        el.removeChild(el.querySelector('.task-widget__item--close'));
        document.body.style.cursor = 'default';
      });
      let draggedEl;
      let draggedElWidth;
      let draggedElHeight;
      el.addEventListener('mousedown', (evt) => {
        evt.preventDefault();
        if (!evt.target.classList.contains('task-widget__item')) {
          return;
        }
        draggedEl = evt.target;
        draggedElWidth = draggedEl.offsetWidth;
        draggedElHeight = draggedEl.offsetHeight;
        draggedEl.closest('.task-widget__column').removeChild(draggedEl);
        document.body.style.cursor = 'grabbing';
        draggedEl.classList.add('task-widget__item--dragged');
        draggedEl.style.width = `${draggedElWidth}px`;
        draggedEl.style.height = `${draggedElHeight}px`;
        document.body.appendChild(draggedEl);
        draggedEl.style.left = `${evt.pageX - draggedEl.offsetWidth / 2}px`;
        draggedEl.style.top = `${evt.pageY - draggedEl.offsetHeight / 2}px`;
      });
      el.addEventListener('mousemove', (evt) => {
        evt.preventDefault();
        if (!draggedEl) {
          return;
        }
        draggedEl.style.left = `${evt.pageX - draggedEl.offsetWidth / 2}px`;
        draggedEl.style.top = `${evt.pageY - draggedEl.offsetHeight / 2}px`;
        const closest = document.elementFromPoint(evt.clientX, evt.clientY);
        const { top } = closest.getBoundingClientRect();
        if (evt.pageY > window.scrollY + top + closest.offsetHeight / 2) {
          // closest.style.paddingBottom = `${draggedElWidth}px`;
        } else {
          // closest.style.paddingTop = `${draggedElWidth}px`;
        }
      });
    });
  }

  addNewCard(button) {
    const addCardForm = document.createElement('div');
    addCardForm.classList.add('add-card__form');
    addCardForm.innerHTML = `<textarea class="add-card__input" rows="2"></textarea>
    <button type="button" class="add-card__button">Add card</button>
    <button type="button" class="add-card__close">&#215;</button>`;
    const column = button.closest('.task-widget__column');
    column.appendChild(addCardForm);
    const input = addCardForm.querySelector('.add-card__input');
    addCardForm.querySelector('.add-card__close').addEventListener('click', () => {
      addCardForm.closest('.task-widget__column').removeChild(addCardForm);
    });
    addCardForm.querySelector('.add-card__button').addEventListener('click', () => {
      TaskWidget.newTask(input.value, column);
      addCardForm.closest('.task-widget__column').removeChild(addCardForm);
    });
  }

  static newTask(text, column) {
    const card = document.createElement('div');
    card.classList.add('task-widget__item');
    card.innerText = `${text}`;
    column.appendChild(card);
  }

  static addDeleteButton(el) {
    const cross = document.createElement('div');
    cross.innerHTML = '&#10008;';
    cross.classList.add('task-widget__item--close');
    el.appendChild(cross);
    cross.addEventListener('click', () => {
      el.closest('.task-widget__column').removeChild(el);
    });
  }
}
