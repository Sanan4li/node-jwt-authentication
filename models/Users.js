const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { isEmail } = require("validator");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Please enter a password with at least 6 characters"],
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  console.log(user);
  if (user) {
    const res = await bcrypt.compare(password, user.password);
    console.log(res);
    if (res) {
      return user;
    } else {
      throw Error("Incorrect Password!");
    }
  } else {
    throw Error("Invalid Email!");
  }
};

const User = mongoose.model("user", userSchema);
module.exports = User;
