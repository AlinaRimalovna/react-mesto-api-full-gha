const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const CastError = require('../errors/CastError');
const NotFoundError = require('../errors/NotFoundError');
const Conflict = require('../errors/Conflict');

const SUCCESS_CODE = 201;
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(SUCCESS_CODE).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании пользователя'));
        return;
      } if (err.code === 11000) {
        next(new Conflict(' Пользователь с таким email уже существует'));
        return;
      }
      next(err);
    });
};
module.exports.findAllUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(next);
};
module.exports.findUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь по данному Id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Переданы некорректные данные при поиске пользователя'));
        return;
      } if (err.message === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь по данному Id не найден'));
        return;
      }
      next(err);
    });
};
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь по данному Id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при обновлении пользователя'));
        return;
      } if (err.message === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь по данному Id не найден'));
        return;
      }
      next(err);
    });
};
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при обновлении пользователя'));
        return;
      } if (err.message === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь по данному Id не найден'));
        return;
      }
      next(err);
    });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  // return
  User.findUserByCredentials(email, password)
    .then((user) => {
      const payload = { _id: user._id, email: user.email };
      const token = jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        });
      return res.send({ _id: user._id, email: user.email });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по данному Id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Переданы некорректные данные при поиске пользователя'));
        return;
      }
      next(err);
    });
};
