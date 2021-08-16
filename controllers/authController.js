const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60;
const handleErrors = (err) => {
  let error = { email: "", password: "" };
  if (err.code === 11000) {
    error["email"] = "Account with this email already exisits.";
    return;
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
  }
  if (err.message === "Invalid Email!") {
    error["email"] = err.message;
  }
  if (err.message === "Incorrect Password!") {
    error["password"] = err.message;
  }
  return error;
};

const createToken = (id) => {
  return jwt.sign({ id }, "smoothie website", {
    expiresIn: maxAge,
  });
};
const signup_get = (req, res) => {
  res.render("signup");
};

const login_get = (req, res) => {
  res.render("login");
};

const signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await User.create({ email, password });
    const token = createToken(result.id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json(result);
  } catch (e) {
    const errors = handleErrors(e);
    res.status(400).json({ errors });
  }
};

const login_post = async (req, res) => {
  try {
    const user = await User.login(req.body.email, req.body.password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user });
  } catch (e) {
    const errors = handleErrors(e);
    res.status(400).send({ errors });
  }
};
const logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
module.exports = {
  signup_get,
  login_get,
  signup_post,
  login_post,
  logout_get,
};
