module.exports = (err, req, res, _next) => {
  const status = err.status || 500;
  const payload = {
    error: err.message || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
  };
  res.status(status).json(payload);
};