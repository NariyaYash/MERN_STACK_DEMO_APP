const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: { type: String, require: true, trim: true },
  lastName: { type: String, require: true, trim: true },
  email: {
    type: String,
    require: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        console.log(value);
        throw new Error("email is invalid");
      }
    },
  },
  password: { type: String, require: true, trim: true, minlength: 10 },
  userName: { type: String, require: true, trim: true },
  tokens: [
    {
      token: String,
    },
  ],
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.tokens;
  return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return;
  }
  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "thisIsMERNstackDemoApp");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.pre("save", async function (next) {
  const user = this;
  try {
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    } else {
      next();
    }
  } catch (error) {
    console.log("Save Middleware Error`", error);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
