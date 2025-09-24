module.exports = function validate(schema, source = "body") {
  return (req, res, next) => {
    try {
      req.validated = schema.parse(req[source]);
      next();
    } catch (err) {
      return res.status(400).json({ error: "ValidationError", details: err.errors });
    }
  };
};