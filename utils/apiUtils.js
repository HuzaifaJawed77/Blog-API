const { query } = require("express");

// ─── Success Response Helper ───
const successResponse = (res, statusCode, message, data) => {
  const response = {
    success: true,
    message,
  };
  if (data) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

// ─── Error Response Helper ───
const errorResponse = (res, statusCode, message) => {
  const response = {
    success: false,
    message,
  };
  return res.status(statusCode).json(response);
};

// pagination helper
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page)) || 1;
  const limit = Math.max(1, parseInt(query.limit)) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

module.exports = { successResponse, errorResponse, getPagination };
