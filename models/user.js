// models/user.js (updated)
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  first_name: String,
  last_name: String,
  role: { type: String, default: "user" },
  avatar: String,
  registration_date: { type: Date, default: Date.now },
  last_login: Date,
  last_activity: Date,
  lastVisits: [
    {
      page: String,
      timestamp: Date
    }
  ],
  email_verification: { type: Boolean, default: false },
  verification_token: String,
});

module.exports = mongoose.model("User", userSchema, "users"); // Force collection 'users'

console.log('TALLENNETAAN VIERAILU:', { userId, page, timestamp });
console.log('TALLENNETAAN KÄYTTÄJÄLLE:', user.lastVisits);

