const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace for debugging
  
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  };
  
  export default errorHandler;
  