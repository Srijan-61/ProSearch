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
  const navigate = useNavigate(); // react router hook - route to another page
  const { userId } = useParams(); // react router hook - get variable from url
  const [user, setUser] = useState<User | null>(null); // user exists or null, default null
  const [isEditing, setIsEditing] = useState(false); // toggles edit modal
  const [editForm, setEditForm] = useState<EditFormData>({
    fullName: "",
    role: "",
    address: "",
    bio: "",
    skills: "",
    experience: "",
  });
  const [loading, setLoading] = useState(true); // loading state for fetch
  const [saving, setSaving] = useState(false); // loading state for save
  const [isOwnProfile, setIsOwnProfile] = useState(false); // check if profile belongs to current user

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  // Fetch data from backend (own vs other user's profile)
  const fetchUserProfile = async () => {
    try {
      let response;
      if (userId) {
        // Fetching another user's profile data
        response = await axiosInstance.get(`/user/user/${userId}`);
        setIsOwnProfile(false);
      } else {
        // Fetching own profile data
        response = await axiosInstance.get("/user/profile");
        setIsOwnProfile(true);
      }

      // Get logged-in username from localStorage
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );

      // store user data from backend to useState
      setUser(response.data.user);

      // initialize or update the form used for editing profile
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
    // Clears the authentication token and the stored user info from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Closes the edit modal and resets the form to current user data
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
    }
  };

  // Sends a PUT request to update the profile on the backend
  const handleSave = async () => {
    try {
      setSaving(true);

      // Collects the data from the edit form into requestData
      const requestData: EditFormData = {
        fullName: editForm.fullName,
        role: editForm.role,
        address: editForm.address,
        bio: editForm.bio,
        skills: editForm.skills,
        experience: editForm.experience,
      };

      // Sends an HTTP PUT request to the endpoint
      const response = await axiosInstance.put("/user/profile", requestData);

      // Updates the user state with the newly updated profile
      setUser(response.data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="app-container">Loading...</div>;
  }

  if (!user) {
    return <div className="app-container">User not found</div>;
  }

  // user initial for pp
  const getInitial = (fullName: string) => {
    if (!fullName) return "";
    return fullName[0].toUpperCase();
  };

  return (
    <div className="app-container">
      {/* Main content card */}
      <div className="profile-card">
        {/* Sidebar */}
        <div className="sidebar">
          {/* Profile Picture */}

          <div className="profile-pic-container">
            <div className="profile-pic">{getInitial(user.username)}</div>
          </div>

          {/* User Name */}
          <h2 className="user-name-sidebar">{user.fullName}</h2>

          {/* Navigation Links */}
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

        {/* Main Content Area */}
        <div className="main-content">
          <div className="header-section">
            <div>
              <h1 className="user-name-main">{user.fullName}</h1>
              <p className="role-main">{user.role}</p>
            </div>
          </div>
          {/* Bio Section */}
          <div className="bio-section">
            <h2 className="section-heading">Bio</h2>
            <div className="bio-text" style={{ whiteSpace: "pre-wrap" }}>
              {user.bio || "No bio provided"}
            </div>
          </div>
          {/* Address Section */}
          <div className="address-section">
            <h2 className="section-heading">Address</h2>
            <div>{user.address || "No address provided"}</div>
          </div>
          {/* Skills Section */}{" "}
          <div className="skills-section">
            {" "}
            <h2 className="section-heading">Skills</h2>{" "}
            <div className="skills-list">
              {" "}
              {user.skills
                ?.split(/\n|,/) // split by newline or comma
                .map((skill: string, index: number) => (
                  <span key={index} className="skill-pill">
                    {" "}
                    {skill.trim()}{" "}
                  </span>
                )) || "No skills provided"}{" "}
            </div>{" "}
          </div>
          {/* Experience Section */}
          <div className="experience-section">
            <h2 className="section-heading">Experience</h2>
            <div style={{ whiteSpace: "pre-wrap" }}>
              {user.experience || "No experience provided"}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal - Only show for own profile */}
      {isEditing && isOwnProfile && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Profile</h2>

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
