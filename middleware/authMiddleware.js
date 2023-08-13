const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const tryCatch = require("../utils/tryCatch");


const authMiddleware = tryCatch(async (req, res, next) => {
  let token;
  if (req?.cookies?.token) {
    token = req.cookies.token;
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized token expired, Please Login again");
    }
  } else {
    throw new Error(" There is no token attached to header");
  }
});

module.exports = authMiddleware;