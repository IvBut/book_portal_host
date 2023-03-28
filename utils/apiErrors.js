class ApiErrors {
  constructor(status, message, details = []) {
    this.status = status;
    this.message = message;
    this.details = details;
  }

  static NotFoundError(message = '', details = []) {
    const msg = message || 'Запрашиваемый ресурс не найден';
    return new ApiErrors(404, msg, details);
  }

  static UnauthorizedError(message = '', details = []) {
    const msg = message || 'Пользователь не авторизован';
    return new ApiErrors(401, msg, details);
  }

  static InternalServerError(message = '', details = []) {
    const msg = message || 'Произошла ошибка, мы работаем над её устранением';
    return new ApiErrors(500, msg, details);
  }
}

module.exports = ApiErrors;
