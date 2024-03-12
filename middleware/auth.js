const jwt = require("jsonwebtoken");
// Tiêu chí số 9: Phân quyền cho các người dùng thành ba dạng: Customer, Admin & Consultant
// Token login sao cho đúng
const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];
  if (!token) {
    return res
      .status(403)
      .json({ message: "A token is required for authentication" });
  }
  try {
    jwt.verify(token, process.env.TOKEN_KEY);
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
  return next();
};
module.exports = verifyToken;
