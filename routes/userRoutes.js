const { Router } = require('express');
const UserService = require('../services/userService');
const { createUserValid, updateUserValid } = require('../middlewares/user.validation.middleware');
const { responseMiddleware } = require('../middlewares/response.middleware');

const router = Router();

router.get(
  '/:id',
  (req, res, next) => {
    const { id } = req.params;

    try {
      res.data = UserService.getOne({ id });
    } catch (err) {
      res.err = err;
      res.status(404);
    }
    next();
  },
  responseMiddleware
);

router.get(
  '/',
  (req, res, next) => {
    try {
      res.data = UserService.getAll();
    } catch (err) {
      res.err = err;
      res.status(404);
    }
    next();
  },
  responseMiddleware
);

router.put('/:id', updateUserValid, (req, res, next) => {
  if (res.err) return next();

  const { id } = req.params;
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    const dataToUpdate = {};
    if (firstName) dataToUpdate.firstName = firstName;
    if (lastName) dataToUpdate.lastName = lastName;
    if (email) dataToUpdate.email = email;
    if (phoneNumber) dataToUpdate.phoneNumber = phoneNumber;
    if (password) dataToUpdate.password = password;
    res.data = UserService.update(id, dataToUpdate);
  } catch (err) {
    res.err = err;
    res.status(400);
  }
  next();
});

router.post(
  '/',
  createUserValid,
  (req, res, next) => {
    if (res.err) return next();
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    try {
      res.data = UserService.create({ firstName, lastName, email, phoneNumber, password });
    } catch (err) {
      res.err = err;
      res.status(400);
    }

    next();
  },
  responseMiddleware
);

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  try {
    const user = UserService.getOne({id});
    if (!user) {
      res.status(404);
      res.err = `User with id ${id} does not exist`;
      return next();
    }
    res.data = UserService.delete(id);
  } catch (err) {
    res.err = err;
    res.status(400);
  }
  next();
}, responseMiddleware);

module.exports = router;
