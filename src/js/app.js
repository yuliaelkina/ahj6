import TaskWidget from './taskWidget';

document.addEventListener('DOMContentLoaded', () => {
  const taskManager = new TaskWidget(document.querySelector('.task-widget'));
  taskManager.init();
});
