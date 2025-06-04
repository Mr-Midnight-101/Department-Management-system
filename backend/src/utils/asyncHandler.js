/* 
 ⭐ wrapper of async handler function utility to handle middlewares and asyncs functions.

*/

export const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => {
      next(error);
    });
  };
};

/*
It is using higher order function
const asyncHandler = (fn)=>()=>{}
takes fn as parameter and pass the required parameters 
const asyncHandler = (fn) => async (req, res, next) => {
    try {
    await (req,res,next)
  } catch (error) {
    res.status(error.code || 500).json({
        success: "false",
      message: error.message,
    });
}
};
*/
