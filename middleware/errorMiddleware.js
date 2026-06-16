// ─── 404 Not Found Handler ────────────────────────────────────────────────────
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass to global error handler below
};

// ─── Global Error Handler ─────────────────────────────────────────────────────

const errorHandler = (err, req, res, next) => {
  // Sometimes a 200 status slips through with an error — default to 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // ── Mongoose: Bad ObjectId (e.g. /posts/invalidid) ──
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found (invalid ID format)";
  }

  // ── Mongoose: Duplicate key (e.g. email already exists) ──
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // ── Mongoose: Validation errors ──
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // ── JWT errors ──
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Show stack trace only in development mode
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};



module.exports = { notFound, errorHandler };