const jwt = require("jsonwebtoken");
const User = require("../model/user");

const auth = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    console.log("1");
    return res.send({ valid: false });
  }
  try {
    const data = jwt.verify(token, "thisIsMERNstackDemoApp");
    const user = await User.findOne({ _id: data._id, "tokens.token": token });

    if (!user) {
      console.log("2");
      return res.send({ valid: false });
    }

    req.token = token;
    req.user = user;

    return next();
  } catch (error) {
    return res.send({ valid: false });
  }
};

module.exports = auth;
