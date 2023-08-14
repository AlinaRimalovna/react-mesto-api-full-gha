const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  findAllUsers, findUser, updateUser, updateUserAvatar, getUserInfo,
} = require('../controllers/users');

const Reg = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/;

router.get('/', findAllUsers);
router.get('/me', getUserInfo);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().required().length(24),
  }),
}), findUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(Reg),
  }),
}), updateUserAvatar);

module.exports = router;
