class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(messagge);
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if(stack){
        this.stack = stack;
    } else [
        Error.captureStackTrace(this, this.constructor)
    ]
  }
}

export {ApiError};
