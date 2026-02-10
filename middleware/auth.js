const User = require("../models/User");


exports.protect = async (req, res, next) => {
if (!req.session.userId) return res.redirect("/login");


const user = await User.findById(req.session.userId).select("-password");
if (!user) return res.redirect("/login");


req.user = user;
res.locals.user = user;
next();
};