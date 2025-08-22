import multer, { memoryStorage } from "multer";
import cloudinary from "../config/cloudinary.config.js";

// buffer means storage data in RAM
// Use memory storage to avoid writing files to disk
const storage = memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/png"].includes(file.mimetype);
    if (!ok) return cb(new Error("Only JPG and PNG allowed"), false);
    cb(null, true);
  },
});


// Upload buffer to Cloudinary
export function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", ...options },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}
