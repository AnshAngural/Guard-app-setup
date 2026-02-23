const User = require("../models/user");
const bcrypt = require("bcrypt");

// ==========================
// SIGNUP
// ==========================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.redirect("/signup");

    const user = await User.create({
      name,
      email,
      password,
    });

    req.session.userId = user._id;
    req.session.user = {
      _id: user._id,
      name: user.name,
      role: user.role,
    };

    res.redirect("/dashboard");

  } catch (error) {
    console.error(error);
    res.redirect("/signup");
  }
};

// ==========================
// LOGIN
// ==========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.redirect("/login");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.redirect("/login");

    req.session.userId = user._id;
    req.session.user = {
      _id: user._id,
      name: user.name,
      role: user.role,
    };

    res.redirect("/dashboard");

  } catch (error) {
    console.error(error);
    res.redirect("/login");
  }
};

// ==========================
// LOGOUT
// ==========================
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
