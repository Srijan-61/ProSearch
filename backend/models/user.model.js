import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30,
  },
  // email: {
  //     type: String,
  //     required: true,
  //     unique: true,
  //     trim: true,
  //     lowercase: true,
  //     match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  // },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  // Profile Information
  fullName: {
    type: String,
    default: "Pro Name",
  },
  role: {
    type: String,
    default: "Professional",
  },
  skills: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = model("User", userSchema);
export default User;
