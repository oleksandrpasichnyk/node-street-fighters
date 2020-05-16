const { UserRepository } = require('../repositories/userRepository');

class UserService {
  getAll() {
    const user = UserRepository.getAll();
    return user || [];
  }

  getOne(search) {
    const user = UserRepository.getOne(search);
    if (!user) return null;
    return user;
  }

  create(data) {
    const item = UserRepository.create(data);
    if (!item) {
      throw Error('User was not created');
    }
    return item;
  }

  search(search) {
    const item = UserRepository.getOne(search);
    if (!item) {
      return null;
    }
    return item;
  }

  update(id, data) {
    const user = UserRepository.update(id, data);
    if (!user) {
      throw Error('User was not updated');
    }
    return user;
  }

  delete(id) {
    const user = UserRepository.delete(id);
    if (!user) throw Error('User was not deleted');
    return user;
  }
}

module.exports = new UserService();
