const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists
  if (!authHeader) {
    return res.status(401).json({
      message: "Åtkomst nekad. Ingen token skickades."
    });
  }

  // Expected format: Bearer tokenhere
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Åtkomst nekad. Token saknas."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save user info from token on the request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Ogiltig eller utgången token."
    });
  }
};

module.exports = authMiddleware;