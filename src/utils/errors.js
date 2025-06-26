class APIError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }

  static badRequest(msg) {
    return new APIError(msg, 400);
  }

  static forbidden(msg) {
    return new APIError(msg, 403);
  }

  static notFound(msg) {
    return new APIError(msg, 404);
  }

  static unauthorized(msg) {
    return new APIError(msg, 401);
  }
}

module.exports = APIError;
