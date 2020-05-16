const { FighterRepository } = require('../repositories/fighterRepository');

class FighterService {
  getAll() {
    const fighters = FighterRepository.getAll();
    return fighters || [];
  }

  getOne(search) {
    const fighter = FighterRepository.getOne(search);
    if (!fighter) {
      throw Error('Fighter with these parameters was not found');
    }
    return fighter;
  }

  create(data) {
    const fighter = FighterRepository.create(data);
    if (!fighter) {
      throw Error('Fighter was not created');
    }
    return fighter;
  }

  update(id, data) {
    const fighter = FighterRepository.update(id, data);
    if (!fighter) {
      throw Error('Fighter was not updated');
    }
    return fighter;
  }

  delete(id) {
    const fighter = FighterRepository.delete(id);
    if (!fighter) throw Error('Fighter was not deleted');
    return fighter;
  }
}

module.exports = new FighterService();
