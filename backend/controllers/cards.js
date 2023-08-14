const Card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const CastError = require('../errors/CastError');
const NotFoundError = require('../errors/NotFoundError');
const Forbidden = require('../errors/Forbidden');

const SUCCESS_CODE = 201;

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(SUCCESS_CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(err);
    });
};
module.exports.findAllCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Карточка по данному Id не найдена'))
    .then((card) => {
      if (String(card.owner) === String(req.user._id)) {
        Card.deleteOne(card)
          .then((deleteCard) => res.status(200).send(deleteCard))
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new CastError('Переданы некорректные данные при удалении карточки'));
              return;
            }
            next(err);
          });
      } else {
        next(new Forbidden('Недостаточно прав для удаления карточки'));
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Пользователь по данному Id не найден'))
    .then((card) => res.status(SUCCESS_CODE).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Переданы некорректные данные для постановки лайка'));
        return;
      } if (err.message === 'DocumentNotFoundError') {
        next(new NotFoundError('Передан несуществующий Id карточки'));
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Пользователь по данному Id не найден'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Переданы некорректные данные для снятия лайка'));
        return;
      } if (err.message === 'DocumentNotFoundError') {
        next(new NotFoundError('Передан несуществующий Id карточки'));
        return;
      }
      next(err);
    });
};
