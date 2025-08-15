import User from "../models/user.model.js";

//  GET USER LIST (Authenticated)
export async function getUserList(req, res) {
  const users = await User.find().select("-password"); // Exclude passwords
  res.status(200).json({
    message: "User list fetched successfully",
    users: users,
  });
}

// SEARCH USERS BY USERNAME
export async function searchUsers(req, res) {
  const { u } = req.query;
  const users = await User.find({
    username: { $regex: u, $options: "i" },
  }).select("-password"); // Exclude passwords
  res.status(200).json({ message: "User search successful", users: users });
}

// GET CURRENT USER PROFILE
export async function getCurrentUserProfile(req, res) {
  const user = await User.findById(req.user.userId).select("-password");
  res.status(200).json({ user });
}

// UPDATE USER PROFILE
export async function updateUserProfile(req, res) {
  const { fullName, role, skills } = req.body;
  const updateData = { fullName, role, skills };
  const user = await User.findByIdAndUpdate(req.user.userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");
  res.status(200).json({
    message: "Profile updated successfully",
    user,
  });
}

// GET USER PROFILE BY ID
export async function getUserProfileById(req, res) {
  const user = await User.findById(req.params.id).select("-password");
  res.status(200).json({ user });
}
