class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", error, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.status =
      statusCode >= 400 && statusCode < 500 ? "Request " : "Request error";
    this.message = message;
    this.data = null;
    this.success = false;
    this.errors = error || null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
