import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = (req, res) => {
  let token = req.cookies.token;
  if (!token) res.status(401).json({ message: "Chưa đăng nhập !" });
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    // console.log("check payload", payload);
    if (err) {
      return res.status(403).json({ message: "Token không đúng !" });
    }
  });
  return res.status(200).json({ message: "Bạn đã đăng nhập !" });
};
export const shouldBeAdmin = (req, res) => {
  let token = req.cookies.token;
  if (!token) res.status(401).json({ message: "Chưa đăng nhập !" });
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    // console.log("check payload", payload);
    if (err) {
      return res.status(403).json({ message: "Token không đúng !" });
    }
    if (!payload.isAdmin) {
      return res.status(403).json({ message: "Không phải admin" });
    }
  });
  return res.status(200).json({ message: "Bạn đã đăng nhập !" });
};
