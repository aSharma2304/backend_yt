// in this file we are trying to make a standardized error response of our api
// this to make our code more structured and make sure all api errors have same format or structure

class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
  }
}

export { ApiError };
