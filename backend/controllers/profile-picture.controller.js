import { uploadBufferToCloudinary } from "../middleware/image-upload.middleware.js";
import User from "../models/user.model.js";

export async function uploadProfilePic(req, res) {
  try {
    // 1. Check if file is uploaded
    if (!req.file) throw new Error("No file uploaded");

    // 2. Determine user ID from JWT payload
    const userId = req.user.userId || req.user.id || req.user._id;
    console.log("User ID from token:", userId);

    if (!userId)
      return res.status(401).json({ error: "User not authenticated" });

    // 3. Upload image to Cloudinary
    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "profilepic",
      public_id: `user_${userId}`,
      transformation: [
        { width: 1000, height: 1000, crop: "fill", gravity: "auto" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    // 4. Update user profile picture
    const user = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: {
          url: result.secure_url,
          public_id: result.public_id,
        },
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ success: true, image: user.profilePic });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
