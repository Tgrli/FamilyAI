const Joi = require('joi');

const loginSchema = Joi.object().keys({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).max(20).required()
});

const registerSchema = Joi.object().keys({
  name: Joi.string().trim().min(2).max(30).required(),
  username: Joi.string()
    .trim()
    .min(2)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/)
    .required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).max(20).required(),
  confirm_password: Joi.string().trim().min(6).max(20).required(),
  invite_code: Joi.string().trim().empty('')
});

module.exports = {
  loginSchema,
  registerSchema
};
