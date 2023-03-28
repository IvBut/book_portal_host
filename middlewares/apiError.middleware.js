const ApiError = require('../utils/apiErrors');
const { errorWrapper } = require('../utils/responseWrapper');

module.exports = (error, req, res, next) => {
  if (error instanceof ApiError) {
    return res.status(error.status).json(errorWrapper(error));
  }

  const defaultErr = ApiError.InternalServerError();
  return res.status(defaultErr.status).json(errorWrapper(defaultErr));
};
