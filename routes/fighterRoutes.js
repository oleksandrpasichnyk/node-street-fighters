const { Router } = require("express");
const FighterService = require("../services/fighterService");
const { responseMiddleware } = require("../middlewares/response.middleware");
const {
  createFighterValid,
  updateFighterValid,
} = require("../middlewares/fighter.validation.middleware");

const router = Router();

router.get(
  '/:id',
  (req, res, next) => {
    const { id } = req.params;

    try {
      res.data = FighterService.getOne({ id });
    } catch (err) {
      res.err = err;
      res.status(404);
    }
    next();
  },
  responseMiddleware
);

router.get(
  "/",
  (req, res, next) => {
    try {
      res.data = FighterService.getAll();
    } catch (err) {
      res.err = err;
      res.status(404);
    }
    next();
  },
  responseMiddleware
);

router.put(
  '/:id',
  updateFighterValid,
  (req, res, next) => {
    if (res.err) return next();
    
    const { id } = req.params;
    try {
      const { name, defense, power } = req.body;
      const dataToUpdate = {};
      if (name) dataToUpdate.name = name;
      if (defense) dataToUpdate.defense = defense;
      if (power) dataToUpdate.power = power;
      res.data = FighterService.update(id, dataToUpdate);
    } catch (err) {
      res.err = err;
      res.status(400);
    }
    next();
  }
);

router.post(
  "/",
  createFighterValid,
  (req, res, next) => {
    if (res.err) return next();
    const { name, power, defense } = req.body;

    try {
      res.data = FighterService.create({ name, power, defense, health: 100 });
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
    const user = FighterService.getOne({id});
    if (!user) {
      res.status(404);
      res.err = `Fighter with id ${id} does not exist`;
      return next();
    }
    res.data = FighterService.delete(id);
  } catch (err) {
    res.err = err;
    res.status(400);
  }
  next();
}, responseMiddleware);

module.exports = router;
