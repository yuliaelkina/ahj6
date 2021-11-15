/* eslint-disable  consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable  no-param-reassign */
/* eslint-disable  no-plusplus */
/* eslint-disable  no-lonely-if */

export default class TaskWidget {
  constructor(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    this._element = element;
    this.buttons = [...document.querySelectorAll('.task-widget__button')];
    this.columns = [...this._element.querySelectorAll('.task-widget__column')];
  }

  init() {
    if (localStorage.getItem('taskWidgetMemory')) {
      const memory = JSON.parse(localStorage.getItem('taskWidgetMemory'));
      for (let i = 0; i < this.columns.length; i++) {
        memory[`column${i}`].forEach((el) => {
          TaskWidget.newTask(el, this.columns[i]);
        });
      }
      this.items = [...document.querySelectorAll('.task-widget__item')];
    }
    this.buttons.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        TaskWidget.addNewCard(el);
      });
    });
    this.items.forEach((el) => {
      this.addEventListenersForCard(el);
    });
    window.addEventListener('unload', () => {
      localStorage.setItem('taskWidgetMemory', `${this.saveTasks()}`);
    });
  }

  static addNewCard(button) {
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

  addEventListenersForCard(el) {
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
    let closest;
    let topCoord;
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
      this.items.forEach((item) => {
        item.style.marginBottom = '2px';
        item.style.marginTop = '2px';
      });
      draggedEl.style.left = `${evt.pageX - draggedEl.offsetWidth / 2}px`;
      draggedEl.style.top = `${evt.pageY - draggedEl.offsetHeight / 2}px`;
      closest = document.elementsFromPoint(evt.clientX, evt.clientY).find((item) => item.className === 'task-widget__item');
      if (!closest) {
        return;
      }
      topCoord = closest.getBoundingClientRect();
      if (evt.pageY > window.scrollY + topCoord + closest.offsetHeight / 2) {
        closest.style.marginBottom = `${draggedElHeight + 2}px`;
      } else {
        closest.style.marginTop = `${draggedElHeight + 2}px`;
      }
    });
    el.addEventListener('mouseup', (evt) => {
      evt.preventDefault();
      if (!draggedEl) {
        return;
      }
      draggedEl.classList.remove('task-widget__item--dragged');
      draggedEl.style.width = '98%';
      draggedEl.style.height = 'auto';
      draggedEl.style.top = 'auto';
      draggedEl.style.left = 'auto';
      document.body.removeChild(draggedEl);
      if (!closest) {
        const parent = document.elementsFromPoint(evt.clientX, evt.clientY).find((item) => item.className === 'task-widget__column');
        parent.appendChild(draggedEl);
      } else {
        if (evt.pageY > window.scrollY + topCoord + closest.offsetHeight / 2) {
          closest.parentNode.insertBefore(draggedEl, closest.nextElementSibling);
        } else {
          closest.parentNode.insertBefore(draggedEl, closest);
        }
      }
      this.items.forEach((item) => {
        item.style.marginBottom = '2px';
        item.style.marginTop = '2px';
      });
      draggedEl = null;
      closest = null;
      topCoord = null;
    });
  }

  static newTask(text, column) {
    const card = document.createElement('div');
    card.classList.add('task-widget__item');
    card.innerText = `${text}`;
    column.appendChild(card);
    this.addEventListenersForCard(card);
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

  saveTasks() {
    const savedTasks = {};
    for (let i = 0; i < this.columns.length; i++) {
      const column = [];
      this.columns[i].querySelectorAll('.task-widget__item').forEach((el) => {
        const task = el.innerText;
        column.push(task);
      });
      savedTasks[`column${i}`] = column;
    }
    return JSON.stringify(savedTasks);
  }
}
