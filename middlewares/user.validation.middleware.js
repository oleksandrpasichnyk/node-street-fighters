const { user } = require('../models/user');
const UserService = require("../services/userService");

const createUserValid = (req, res, next) => {
    // TODO: Implement validatior for user entity during creation
    const { firstName, lastName, email, phoneNumber, password } = req.body;
  try {
    const user = UserService.getOne({ name });
    if (user) {
      res.status(400);
      console.log(`User with email '${email}' already exists`);
      res.err = `User with email '${email}' already exists`;
      return next();
    }
  } catch (err) {}
  if (!firstName || firstName === "") {
    res.status(400);
    res.err = "Firstname cannot be an empty string";
    return next();
  }
  if (!lastName || lastName === "") {
    res.status(400);
    res.err = "Lastname cannot be an empty string";
    return next();
  }
  if (
    !phoneNumber ||
    !(/\+380\d{9}/g).test(phoneNumber)
  ) {
    res.status(400);
    res.err = "Phonenumber should be +380xxxxxxxxx";
    return next();
  }
  if (
    !email ||
    !(/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/).test(email)
  ) {
    res.status(400);
    res.err = "Email address should be gmail";
    return next();
  }
  if (
    !password ||
    password.length < 3
  ) {
    res.status(400);
    res.err = "Password should contain min 3 symbols";
    return next();
  }
    next();
}

const updateUserValid = (req, res, next) => {
    // TODO: Implement validatior for user entity during update
    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    try {
        UserService.getOne({ id });
    } catch (err) {
        res.status(404);
        res.error = `User with id ${id} was not found`;
        return next();
    }
    if (firstName && typeof firstName === "string" && firstName.length > 50) {
        res.status(400);
        res.err = "Firstname should not exceed 50 characters";
        return next();
    }
    if (lastName && typeof lastName === "string" && lastName.length > 50) {
        res.status(400);
        res.err = "Lastname should not exceed 50 characters";
        return next();
    }
    if (
        !phoneNumber ||
        !(/\+380\d{9}/g).test(phoneNumber)
      ) {
        res.status(400);
        res.err = "Phonenumber should be +380xxxxxxxxx";
        return next();
      }
      if (
        !email ||
        !(/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/).test(email)
      ) {
        res.status(400);
        res.err = "Email address should be gmail";
        return next();
      }
      if (
        !password ||
        password.length < 3
      ) {
        res.status(400);
        res.err = "Password should contain min 3 symbols";
        return next();
      }
    next();
}

exports.createUserValid = createUserValid;
exports.updateUserValid = updateUserValid;