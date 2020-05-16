const { fighter } = require("../models/fighter");
const FighterService = require("../services/fighterService");

const createFighterValid = (req, res, next) => {
  const { name, power, defense } = req.body;
  try {
    const fighter = FighterService.getOne({ name });
    if (fighter) {
      res.status(400);
      res.err = `Fighter with name '${name}' already exists`;
      return next();
    }
  } catch (err) {}
  if (!name || name === "") {
    res.status(400);
    res.err = "Name cannot be an empty string";
    return next();
  }
  if (
    !power ||
    isNaN(Number(power)) ||
    Number(power) < 0 ||
    Number(power) > 100
  ) {
    res.status(400);
    res.err = "Power should be in range 0 - 100";
    return next();
  }
  if (
    !defense ||
    isNaN(Number(defense)) ||
    Number(defense) < 1 ||
    Number(defense) > 10
  ) {
    res.status(400);
    res.err = "Defence should be in range 1 - 10";
    return next();
  }
  next();
};

const updateFighterValid = (req, res, next) => {
  const { id } = req.params;
  const { name, power, defense } = req.body;
  try {
    FighterService.getOne({ id });
  } catch (err) {
    res.status(404);
    res.error = `Fighter with id ${id} was not found`;
    return next();
  }
  if (name && typeof name === "string" && name.length > 50) {
    res.status(400);
    res.err = "Name should not exceed 50 characters";
    return next();
  }
  if (
    defense &&
    !isNaN(Number(defense)) &&
    (Number(defense) < 1 || Number(defense) > 10)
  ) {
    res.status(400);
    res.err = "Defence should be in range 1 - 10";
    return next();
  }
  next();
};

exports.createFighterValid = createFighterValid;
exports.updateFighterValid = updateFighterValid;
