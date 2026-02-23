const User = require("../models/user");

exports.protect = async (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    const user = await User.findById(req.session.userId).select("-password");

    if (!user) {
        return res.redirect("/login");
    }

    req.user = user;
    res.locals.user = user;

    next();
};

exports.adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.redirect("/dashboard");
    }
    next();
};
