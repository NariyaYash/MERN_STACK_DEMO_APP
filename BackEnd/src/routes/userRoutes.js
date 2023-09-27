const express = require("express");
const User = require("../model/user");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const COOKIES_OPTIONS = require("../../cookiesOption");

const route = express.Router();

//SESSION MENEGMENT:
route.get("/", auth, async (req, res) => {
  const token = req.cookies.access_token;
  if (token) {
    try {
      const user = await req.user;
      return res.send({ valid: true, user: user });
    } catch (error) {
      return res.status(445).send({ Error: "User Data can't find" });
    }
  } else {
    return res.send({ valid: false });
  }
});

//CREATE USER:
route.post("/addUser", async (req, res) => {
  const user = new User(req.body);
  try {
    const isEmail = await User.findOne({ email: user.email });
    if (isEmail) {
      return alert("Email is Exists");
    }
    const token = await user.generateAuthToken();
    // req.session.username  = user.email;
    await user.save();
    res
      .cookie("access_token", token, COOKIES_OPTIONS)
      .status(201)
      .send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

//lOG_IN USER:
route.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    console.log(user);
    if (user === undefined) {
      return res.status(400).send({ Error: "Login unable" });
    }

    const token = await user.generateAuthToken();
    res
      .cookie("access_token", token, COOKIES_OPTIONS)
      .status(201)
      .send({ user, token });
  } catch (error) {
    return res.status(400).send({ Error: error });
  }
});

//UPDATE USER:
route.patch("/user/update", auth, async (req, res) => {
  const email = req.user.email;
  const isemail = await User.findOne({ email: email }).then((res) => {
    return res.email;
  });

  if (isemail && isemail !== email) {
    return res.status(445).send({ error: "Email id allredy Exists!!!" });
  }

  const updates = Object.keys(req.body);

  const allowUpdates = ["firstName", "lastName", "email", "userName"];
  const isValidOpretion = updates.every((update) => {
    return allowUpdates.includes(update);
  });
  if (!isValidOpretion) {
    return res.status(400).send({ Error: "Invalid Updates!!" });
  }
  try {
    const user = await req.user;
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

//UPDATE-USER-PASSWORD DATA:
route.patch("/user/passwordUpdate", auth, async (req, res) => {
  try {
    const user = req.user;
    const password = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      user.password = newPassword;
      user.save();
      return res.send({ isPasswordCorrect: true });
    } else {
      return res.send({ isPasswordCorrect: false });
    }
  } catch (error) {
    return res.send({ isPasswordCorrect: false });
  }
});
 
//USER_LOG-OUT
route.get("/user/logout", auth, async (req, res) => {
  req.user.tokens = req.user.tokens.filter(
    (token) => token.token !== req.token
  );
  await req.user.save();
  return res
    .clearCookie("access_token")
    .send({ message: "Successfully logged out 😏 🍀" });
});

module.exports = route;
