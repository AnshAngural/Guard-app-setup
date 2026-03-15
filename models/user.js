const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [4, "Password must be at least 4 characters"],  // plain text check before hashing
    },

    role: {
      type: String,
      enum: ["guard", "admin"],
      default: "guard",
    },
  },
  { timestamps: true }
);

// ==============================
// HASH PASSWORD BEFORE SAVE
// ==============================
userSchema.pre("save", async function (next) {   // always pass next
  if (!this.isModified("password")) return next();

  // Re-validate length before hashing — bcrypt silently truncates > 72 chars
  if (this.password.length < 4) {
    return next(new Error("Password must be at least 4 characters"));
  }

  const salt     = await bcrypt.genSalt(10);
  this.password  = await bcrypt.hash(this.password, salt);
  next();
});

// ==============================
// PASSWORD COMPARISON METHOD
// ==============================
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);