const { FightRepository } = require('../repositories/fightRepository');

class FightersService {
    create(data) {
      const fight = FightRepository.create(data);
      if (!fight) {
        throw Error('Fight was not created');
      }
      return fight;
    }
}

module.exports = new FightersService();
