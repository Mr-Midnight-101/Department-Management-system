// 🔧 Utility to handle errors in Production
const prodMode = (err, res) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "fail";
  const message = err.message || "Something went wrong, please try again.";

  res.status(statusCode).json({
    status,
    message,
  });
};

// 🛠️ Utility to handle errors in Development
const devMode = (err, res) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "fail";
  const message = err.message || "Something went wrong, please try again.";

  res.status(statusCode).json({
    status,
    statusCode,
    message,
    stack: err.stack,
    error: err,
  });
};

// 🌐 Global Error Handling Middleware
function globalErrorHandler(err, req, res, next) {
  if (process.env.NODE_ENV === "development") {
    devMode(err, res);
  } else {
    prodMode(err, res);
  }
}

export default globalErrorHandler;
