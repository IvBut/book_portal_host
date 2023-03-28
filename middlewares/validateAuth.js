const ApiError = require('../utils/apiErrors');
const { extractValidationErrors } = require('../utils/validation');
const yup = require('yup');

const emailRules = yup.string().required().min(3).max(60).email();
const nameRules = yup.string().required().min(3).max(60);
const passwordRules = yup
  .string()
  .required()
  .min(8)
  .max(60)
  .matches(/[a-zA-Z0-9^\w]/);
const registerSchema = yup.object({
  name: nameRules,
  email: emailRules,
  password: passwordRules
});

const loginSchema = yup.object().shape(
  {
    name: yup.string().when(['name', 'email'], {
      is: (nameVal, emailVal) => !nameVal && !!emailVal,
      then: yup.string().optional().nullable(),
      otherwise: nameRules
    }),
    email: yup.string().when(['email', 'name'], {
      is: (emailVal, nameVal) => !emailVal && !!nameVal,
      then: yup.string().optional().nullable(),
      otherwise: emailRules
    }),
    password: passwordRules
  },
  [
    ['name', 'email'],
    ['name', 'name'],
    ['email', 'name'],
    ['email', 'email']
  ]
);

const validateAuth = type => async (req, res, next) => {
  try {
    const schema = type === 'login' ? loginSchema : registerSchema;
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (e) {
    next(new ApiError(400, 'Проверьте параметры запроса', extractValidationErrors(e)));
  }
};

module.exports = {
  validateAuth
};
