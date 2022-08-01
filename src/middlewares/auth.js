const { decodeJwt } = require("../helpers/jwtHelper");

const authorization = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const data = decodeJwt(token);
    req.user_id = data.id;
    req.is_admin = data.is_admin;
    return next();
  } catch {
    return res.sendStatus(401);
  }
};

module.exports = authorization;
