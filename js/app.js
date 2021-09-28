/* eslint-disable  consistent-return */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import Game from './Game';

document.addEventListener('DOMContentLoaded', () => {
  const goblinGame = new Game('.game');
  let clicked = 0;
  document.addEventListener('click', (e) => {
    if (e.target.closest('.goblin')) {
      clicked = 1;
      goblinGame.deleteGoblin();
    }
  });
  const dead = document.querySelector('.score__positive-value');
  const lost = document.querySelector('.score__negative-value');
  let deadGoblins;
  let lostGoblins;
  function clear() {
    deadGoblins = 0;
    lostGoblins = 0;
    dead.textContent = 0;
    lost.textContent = 0;
  }
  goblinGame.createGoblin();
  const Timer = setInterval(() => {
    if (clicked === 0) {
      lostGoblins = parseInt(lost.textContent, 10);
      if (lostGoblins === 4) {
        clear();
        return alert('Повезет в следующий раз');
      }
      lost.textContent = lostGoblins + 1;
      goblinGame.moveYourGoblin();
    }
    if (clicked === 1) {
      deadGoblins = parseInt(dead.textContent, 10);
      if (deadGoblins === 9) {
        clicked = 0;
        goblinGame.createGoblin();
        clear();
        return alert('Вы гроза гоблинов!');
      }
      dead.textContent = deadGoblins + 1;
      goblinGame.createGoblin();
      clicked = 0;
    }
  }, 1000);
});
