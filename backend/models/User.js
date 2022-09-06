const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, uppercase: true, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["client", "admin"],
    default: "client",
  },
  createdOn: { type: Date, default: Date.now() },
  image: String,

});

module.exports = User = mongoose.model("User", UserSchema);
