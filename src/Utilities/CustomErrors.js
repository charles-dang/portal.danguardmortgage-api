

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
    // 
    this.httpResponse = (res) => {
      res.status(500).send(this.message);
    }
  }
}

class DataBaseReadError extends BaseError{
  constructor(message, name = 'DatabaseRead Error') {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message, name);
  }

  httpResponse = (res) => {
    res.status(500).send(this.message);
  }
}

class DataBaseWriteError extends BaseError{
  constructor(message, name = 'DatabaseWrite Error') {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message, name);
  }

  httpResponse = (res) => {
    res.status(500).send(this.message);
  }
}

class AccessPermissonError extends BaseError {
  constructor(message, name = 'AccessPermissonError') {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message, name);
  }

  httpResponse = (res) => {
    res.status(403).send(this.message);
  }
}

class NotFoundError extends BaseError {
  constructor(message, name = 'NotFoundError') {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message, name);
  }
  
  httpResponse = (res) => {
    res.status(404).send(this.message);
  }
}

class ValidationError extends BaseError {
  constructor(message, name = 'ValidationError') {
    super(message, name);
  }

  httpResponse = (res) => {
    res.status(422).send(this.message);
  }
}

//This function detect if given error is of a known error type and set HTTP status code acordingly
function respondHttpErrors(res, error){
	console.log(error);
  if (error instanceof BaseError){
    error.httpResponse(res);
  }
  else{
    res.status(500).send(error.message);
  }
}


module.exports = {
	ValidationError:ValidationError,
	NotFoundError: NotFoundError,
  DataBaseReadError: DataBaseReadError,
  DataBaseWriteError: DataBaseWriteError,
	respondHttpErrors: respondHttpErrors
}
