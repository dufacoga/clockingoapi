module.exports = function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  const expected = process.env.API_KEY;

  if (!apiKey || apiKey !== expected) {
    return res.status(401).json({ error: 'Unauthorized: invalid API key' });
  }

  next();
};