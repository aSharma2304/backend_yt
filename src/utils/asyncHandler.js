// this function is nothing but a wrapper for async tasks,
// it saves us from writing same code of using try catch and handling async functions
// this is nothing but a higher order functions
// which takes in other functions as parameters

// it takes a function and return a async function which has all things haandeled for us

const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      res.status(err.code || 500).json({
        success: false,
        message: err.message,
      });
    }
  };
};

export default asyncHandler;
