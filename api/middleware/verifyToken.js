import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "khong cho voo!" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        return res.status(403).json({ message: "Token không đúng !" });
      }
      req.userId = payload.id;
      next();
    });
  }
};
