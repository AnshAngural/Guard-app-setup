const User = require("../models/User");
const bcrypt = require("bcryptjs");


exports.signup = async (req, res) => {
const { name, email, password } = req.body;


const existingUser = await User.findOne({ email });
if (existingUser) return res.send("User already exists");


const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);


const user = await User.create({
name,
email,
password: hashedPassword
});


req.session.userId = user._id;
res.redirect("/");
};


exports.login = async (req, res) => {
const { email, password } = req.body;


const user = await User.findOne({ email });
if (!user) return res.send("Invalid credentials");


const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.send("Invalid credentials");


req.session.userId = user._id;
res.redirect("/");
};


exports.logout = (req, res) => {
req.session.destroy(() => {
res.redirect("/login");
});
};