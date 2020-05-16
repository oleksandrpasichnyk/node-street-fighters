import { controls } from '../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (firstFighter.health <= 0 || secondFighter.health <= 0) {
        const loser = [firstFighter, secondFighter].find((fighter) => fighter.health <= 0);
        const winner = [firstFighter, secondFighter].find((fighter) => fighter.health > 0);
        resolve({ winner, loser });
      } else {
        reject(new Error('Whoops!'));
      }
    }, 0);
  });
}

export function getDamage(attacker, defender) {
  // return damage
  let attackValue = getHitPower(attacker);
  let defenseValue = getBlockPower(defender);
  return defenseValue >= attackValue ? 0 : attackValue - defenseValue;
}

export function getHitPower(fighter) {
  // return hit power
  let randomNumber = Math.random() + 1;
  return fighter.power * randomNumber;
}

export function getComboPower(fighter) {
  // return hit power
  return fighter.power * 2;
}

export function getBlockPower(fighter) {
  // return block power
  let randomNumber = Math.random() + 1;
  return fighter.defense * randomNumber;
}

let isComboFirst, isComboSecond, index;
let previousTimeFirst, previousTimeSecond, currentTime;
export function keyDownAction(pressedKeys, firstFighter, secondFighter) {
  const firstMaxHealth = firstFighter.health;
  const secondMaxHealth = secondFighter.health;

  let log = {
    fighter1Shot: 0,
    fighter2Shot: 0,
    fighter1Health: firstMaxHealth,
    fighter2Health: secondMaxHealth,
  };

  [isComboFirst, isComboSecond] = [true, true];
  controls.PlayerOneCriticalHitCombination.forEach((key) => {
    isComboFirst = isComboFirst && pressedKeys.includes(key);
    if (!isComboFirst) {
      return 0;
    }
    index = pressedKeys.indexOf(key);
    pressedKeys.splice(index, 1);
  });

  controls.PlayerTwoCriticalHitCombination.forEach((key) => {
    isComboSecond = isComboSecond && pressedKeys.includes(key);
    if (!isComboSecond) {
      return 0;
    }
    index = pressedKeys.indexOf(key);
    pressedKeys.splice(index, 1);
  });

  currentTime = new Date();

  function isValidInterval(previousTime) {
    if (previousTime === undefined) {
      return true;
    }
    let seconds = (currentTime - previousTime) / 1000;
    return seconds >= 10 ? true : false;
  }

  if (isComboFirst && isValidInterval(previousTimeFirst)) {
    pressedKeys.push('KeyComboFirst');
    previousTimeFirst = currentTime;
  }

  if (isComboSecond && isValidInterval(previousTimeSecond)) {
    pressedKeys.push('KeyComboSecond');
    previousTimeSecond = currentTime;
  }

  if (pressedKeys.includes(controls.PlayerOneAttack) && pressedKeys.includes(controls.PlayerOneBlock)) {
    index = pressedKeys.indexOf(controls.PlayerOneAttack);
    pressedKeys.splice(index, 1);
  }

  if (pressedKeys.includes(controls.PlayerTwoAttack) && pressedKeys.includes(controls.PlayerTwoBlock)) {
    index = pressedKeys.indexOf(controls.PlayerTwoAttack);
    pressedKeys.splice(index, 1);
  }
  //pressedKeys = pressedKeys.filter(key => Object.values(controls).includes(key));
  if (pressedKeys.length !== 0) {
    let damage;
    let firstAction = '';
    let secondAction = '';

    for (let i = 0; i < pressedKeys.length; i++) {
      switch (pressedKeys[i]) {
        case 'KeyA':
          firstAction = 'attack';
          break;
        case 'KeyD':
          firstAction = 'block';
          break;
        case 'KeyJ':
          secondAction = 'attack';
          break;
        case 'KeyL':
          secondAction = 'block';
          break;
        case 'KeyComboFirst':
          firstAction = 'combo';
          break;
        case 'KeyComboSecond':
          secondAction = 'combo';
          break;
      }
    }

    const rightFighterbar = document.querySelector('#right-fighter-indicator');
    const leftFighterbar = document.querySelector('#left-fighter-indicator');
    if (firstAction === 'block' && secondAction !== 'combo') {
      return 0;
    }
    if (secondAction === 'block' && firstAction !== 'combo') {
      return 0;
    }

    if (firstAction === 'combo' || firstAction === 'attack') {
      firstAction === 'combo'
        ? (damage = Number(getComboPower(firstFighter).toFixed(0)))
        : (damage = Number(getDamage(firstFighter, secondFighter).toFixed(0)));
      log.fighter1Shot = damage;
      log.fighter2Health = secondFighter.health - damage;
      renderBar(rightFighterbar, log.fighter2Health, secondMaxHealth);
    }

    if (secondAction === 'combo' || secondAction === 'attack') {
      secondAction === 'combo'
        ? (damage = Number(getComboPower(secondFighter).toFixed(0)))
        : (damage = Number(getDamage(secondFighter, firstFighter).toFixed(0)));
      log.fighter2Shot = damage;
      log.fighter1Health = firstFighter.health - damage;
      renderBar(leftFighterbar, log.fighter1Health, firstMaxHealth);
    }

    function renderBar(bar, health, maxhealth) {
      bar.style.width = ((100 * (health >= 0 ? health : 0)) / maxhealth).toFixed(0) + '%';
    }

    if (log && typeof log !== 'undefined') return log;
  }
}
