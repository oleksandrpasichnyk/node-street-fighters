const { Router } = require('express');
const FightService = require('../services/fightService');
const { responseMiddleware } = require('../middlewares/response.middleware');

const router = Router();

router.post(
  '/',
  (req, res, next) => {
    const { winnerId, loserId, logs } = req.body;

    try {
      res.data = FightService.create({ fighter1: winnerId, fighter2: loserId, logs });
    } catch (err) {
      res.err = err;
      res.status(400);
    }
    next();
  },
  responseMiddleware
);

module.exports = router;
