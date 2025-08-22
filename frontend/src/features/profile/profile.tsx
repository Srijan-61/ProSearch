import "./profile.css";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../shared/config/axiosinstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// TS way of defining structure of object
interface User {
  _id: string;
  username: string;
  fullName: string;
  role: string;
  address: string;
  bio: string;
  skills: string;
  experience: string;
  profilePic?: { url: string; public_id: string }; // profile picture
}

interface EditFormData {
  fullName: string;
  role: string;
  address: string;
  bio: string;
  skills: string;
  experience: string;
}

function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData>({
    fullName: "",
    role: "",
    address: "",
    bio: "",
    skills: "",
    experience: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Profile picture states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      let response;
      if (userId) {
        console.log("Fetching user profile for ID:", userId);
        response = await axiosInstance.get(`/user/user/${userId}`);
        setIsOwnProfile(false);
      } else {
        response = await axiosInstance.get("/user/profile");
        setIsOwnProfile(true);
      }

      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );

      console.log("Profile response:", response.data);
      setUser(response.data.user);

      setEditForm({
        fullName: response.data.user.fullName || currentUser?.username || "",
        role: response.data.user.role || "Professional",
        address: response.data.user.address || "Address",
        bio: response.data.user.bio || "bio",
        skills: response.data.user.skills || "",
        experience: response.data.user.experience || "experience",
      });
    } catch (err: any) {
      toast.error("Failed to fetch profile");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setEditForm({
        fullName: user.fullName || "",
        role: user.role || "Professional",
        address: user.address || "Address",
        bio: user.bio || "bio",
        skills: user.skills || "",
        experience: user.experience || "experience",
      });
      setSelectedFile(null);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const requestData: EditFormData = { ...editForm };
      const response = await axiosInstance.put("/user/profile", requestData);
      setUser(response.data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return toast.error("Please select an image first");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setUploading(true);
      
      const res = await axiosInstance.post(
        "/user/uploadProfilePic",
        formData
      );

      console.log("Upload response:", res.data);
      
      setUser((prev) =>
        prev ? { ...prev, profilePic: res.data.image } : prev
      );
      setSelectedFile(null);
      
      // Refresh the profile data to get updated user info
      await fetchUserProfile();
      
      toast.success("Profile picture updated successfully!");
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="app-container">Loading...</div>;
  if (!user) return <div className="app-container">User not found</div>;

  const getInitial = (fullName: string, username: string) => {
    if (fullName) return fullName[0].toUpperCase();
    if (username) return username[0].toUpperCase();
    return "U";
  };

  return (
    <div className="app-container">
      <div className="profile-card">
        <div className="sidebar">
          <div className="profile-pic-container">
            {user.profilePic?.url ? (
              <img
                src={user.profilePic.url}
                alt="Profile"
                className="profile-pic-img"
              />
            ) : (
              <div className="profile-pic">{getInitial(user.fullName, user.username)}</div>
            )}
          </div>

          <h2 className="user-name-sidebar">{user.fullName}</h2>

          <nav className="nav-menu">
            <ul className="nav-list">
              <li>
                <Link to="/home">Home</Link>
              </li>
              {isOwnProfile && (
                <>
                  <li>
                    <button onClick={handleLogout} className="logout-button">
                      Logout
                    </button>
                  </li>
                  <li>
                    <button onClick={handleEdit} className="edit-button">
                      Edit Profile
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>

        <div className="main-content">
          <div className="header-section">
            <h1 className="user-name-main">{user.fullName}</h1>
            <p className="role-main">{user.role}</p>
          </div>

          <div className="bio-section">
            <h2 className="section-heading">Bio</h2>
            <div className="bio-text" style={{ whiteSpace: "pre-wrap" }}>
              {user.bio || "No bio provided"}
            </div>
          </div>

          <div className="address-section">
            <h2 className="section-heading">Address</h2>
            <div>{user.address || "No address provided"}</div>
          </div>

          <div className="skills-section">
            <h2 className="section-heading">Skills</h2>
            <div className="skills-list">
              {user.skills?.split(/\n|,/).map((skill, i) => (
                <span key={i} className="skill-pill">
                  {skill.trim()}
                </span>
              )) || "No skills provided"}
            </div>
          </div>

          <div className="experience-section">
            <h2 className="section-heading">Experience</h2>
            <div style={{ whiteSpace: "pre-wrap" }}>
              {user.experience || "No experience provided"}
            </div>
          </div>
        </div>
      </div>

      {isEditing && isOwnProfile && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Profile</h2>

            {/* Profile Picture Upload */}
            <div className="form-group">
              <label>Profile Picture:</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <button
                onClick={handleUpload}
                disabled={uploading}
                style={{ marginTop: "8px" }}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>

            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                value={editForm.fullName}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, fullName: e.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label>Role:</label>
              <input
                type="text"
                value={editForm.role}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, role: e.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                value={editForm.address}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, address: e.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label>Bio:</label>
              <textarea
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, bio: e.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label>Skills:</label>
              <textarea
                value={editForm.skills}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, skills: e.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label>Experience:</label>
              <textarea
                value={editForm.experience}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    experience: e.target.value,
                  }))
                }
              />
            </div>

            <div className="modal-buttons">
              <button
                onClick={handleSave}
                className="save-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
