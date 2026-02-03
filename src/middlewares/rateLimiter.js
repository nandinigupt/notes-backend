let requests = [];

module.exports = (req, res, next) => {
  const now = Date.now();

  requests = requests.filter(time => now - time < 60000);

  if (requests.length >= 5) {
    return res.status(429).json({
      error: "Max 5 notes per minute allowed"
    });
  }

  requests.push(now);
  next();
};
