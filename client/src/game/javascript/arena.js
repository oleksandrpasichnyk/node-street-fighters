import { createElement } from './helpers/domHelper';
import { createFighterImage } from './fighterPreview';
import { fight, keyDownAction } from './fight';
import { showModal } from './modal/modal';

export class Arena {
  constructor(fighters, onFinish) {
    const [firstFighter, secondFighter] = fighters;

    const root = document.getElementById('fight-container');
    const arena = createArena([firstFighter, secondFighter]);
    root.innerHTML = '';
    root.append(arena);

    this.onFinish = onFinish;
    this.firstFighter = firstFighter;
    this.secondFighter = secondFighter;
    this.gameLog = [];
    this.pressedKeys = [];
  }

  trackKeys = () => {
    document.addEventListener('keydown', this.catchKeys);
  };

  catchKeys = (event) => {
    this.pressedKeys.push(event.code);
    setTimeout(async () => {
      const log = keyDownAction(this.pressedKeys, this.firstFighter, this.secondFighter);

      this.pressedKeys = [];
      if (!log || typeof log === 'undefined') return;

      this.firstFighter.health = log.fighter1Health;
      this.secondFighter.health = log.fighter2Health;

      this.gameLog.push(log);

      if (log.fighter1Health <= 0 || log.fighter2Health <= 0) {
        try {
          const { winner, loser } = await fight(this.firstFighter, this.secondFighter);

          if (!winner || !loser) showModal({ title: 'Something went wrong' });

          document.removeEventListener('keydown', this.catchKeys);
          this.onFinish(winner, loser, this.gameLog);
        } catch (err) {
          console.error(err);
        }
      }
    }, 200);
  };
}

function createArena(selectedFighters) {
  const arena = createElement({ tagName: 'div', className: 'arena___root' });
  const healthIndicators = createHealthIndicators(...selectedFighters);
  const fighters = createFighters(...selectedFighters);

  arena.append(healthIndicators, fighters);
  return arena;
}

function createHealthIndicators(leftFighter, rightFighter) {
  const healthIndicators = createElement({ tagName: 'div', className: 'arena___fight-status' });
  const versusSign = createElement({ tagName: 'div', className: 'arena___versus-sign' });
  const leftFighterIndicator = createHealthIndicator(leftFighter, 'left');
  const rightFighterIndicator = createHealthIndicator(rightFighter, 'right');

  healthIndicators.append(leftFighterIndicator, versusSign, rightFighterIndicator);
  return healthIndicators;
}

function createHealthIndicator(fighter, position) {
  const { name } = fighter;
  const container = createElement({ tagName: 'div', className: 'arena___fighter-indicator' });
  const fighterName = createElement({ tagName: 'span', className: 'arena___fighter-name' });
  const indicator = createElement({ tagName: 'div', className: 'arena___health-indicator' });
  const bar = createElement({
    tagName: 'div',
    className: 'arena___health-bar',
    attributes: { id: `${position}-fighter-indicator` },
  });

  fighterName.innerText = name;
  indicator.append(bar);
  container.append(fighterName, indicator);

  return container;
}

function createFighters(firstFighter, secondFighter) {
  const battleField = createElement({ tagName: 'div', className: `arena___battlefield` });
  const firstFighterElement = createFighter(
    {
      name: firstFighter.name,
      source: 'https://media.giphy.com/media/kdHa4JvihB2gM/giphy.gif',
    },
    'left'
  );
  const secondFighterElement = createFighter(
    {
      name: secondFighter.name,
      source: 'https://i.pinimg.com/originals/46/4b/36/464b36a7aecd988e3c51e56a823dbedc.gif',
    },
    'right'
  );

  battleField.append(firstFighterElement, secondFighterElement);
  return battleField;
}

function createFighter(fighter, position) {
  const imgElement = createFighterImage(fighter);
  const positionClassName = position === 'right' ? 'arena___right-fighter' : 'arena___left-fighter';
  const fighterElement = createElement({
    tagName: 'div',
    className: `arena___fighter ${positionClassName}`,
  });

  fighterElement.append(imgElement);
  return fighterElement;
}
