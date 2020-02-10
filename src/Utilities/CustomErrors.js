

class BaseError extends Error {
  constructor(message, name = 'BaseError') {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
	
    this.name = name;
    this.message = message;

    // Custom debugging information
  }
}
class AccessPermissonError extends BaseError {
  constructor(message, name = 'AccessPermissonError') {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message, name);
  }
}

class NotFoundError extends BaseError {
  constructor(message, name = 'NotFoundError') {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message, name);
  }
}

class ValidationError extends BaseError {
  constructor(message, name = 'ValidationError') {
    super(message, name);
  }
}

function respondHttpErrors(res, error){
	console.log(error);
  	if (error instanceof ValidationError) {
  		res.status(422).send(error.message);
  		return;
	} 
	else {
		console.error(error);
  		res.status(500).send(error.message);
  		return;
	}
  }

module.exports = {
	ValidationError:ValidationError,
	NotFoundError: NotFoundError,
	respondHttpErrors: respondHttpErrors
}
