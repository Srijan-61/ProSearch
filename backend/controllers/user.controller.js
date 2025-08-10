import User from "../models/user.model.js";

//  GET USER LIST (Authenticated)
export async function getUserList(req, res) {
  try {
    const users = await User.find().select("-password"); // Exclude passwords

    res.status(200).json({
      message: "User list fetched successfully",
      users: users,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
}

// SEARCH USERS BY USERNAME
export async function searchUsers(req, res) {
  try {
    const { u } = req.query;
    if (!u) {
      return res.status(400).json({ message: "Query parameter u is required" });
    }
    // Search by username
    const users = await User.find({
      username: { $regex: u, $options: "i" },
    }).select("-password"); // Exclude passwords

    res.status(200).json({ message: "User search successful", users: users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET CURRENT USER PROFILE
export async function getCurrentUserProfile(req, res) {
  try {
    // console.log('getCurrentUserProfile called with user:', req.user);
    const user = await User.findById(req.user.userId).select("-password");
    // console.log('Found user:', user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error("Error in getCurrentUserProfile:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// UPDATE USER PROFILE
export async function updateUserProfile(req, res) {
  try {
    // console.log('updateUserProfile called with body:', req.body);
    // console.log('User ID from token:', req.user.userId);

    const { fullName, role, skills } = req.body;

    const updateData = { fullName, role, skills };

    // console.log('Update data:', updateData);

    const user = await User.findByIdAndUpdate(req.user.userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    // console.log('Updated user:', user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error("Error in updateUserProfile:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET USER PROFILE BY ID
export async function getUserProfileById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
