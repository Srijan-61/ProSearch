import "./profile.css";
import profilePic from "../../assets/profile-pic.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../shared/config/axiosinstance";

interface User {
  _id: string;
  username: string;
  fullName: string;
  role: string;
  skills: string; // changed to string
}

interface EditFormData {
  fullName: string;
  role: string;
  skillsText: string;
}

function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData>({
    fullName: "",
    role: "",
    skillsText: "",
  });
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      console.log("Fetching user profile...");
      let response;
      if (userId) {
        // Fetching another user's profile
        // console.log("Fetching other user profile for ID:", userId);
        response = await axiosInstance.get(`/user/user/${userId}`);
        setIsOwnProfile(false);
      } else {
        // Fetching own profile
        // console.log("Fetching own profile");
        response = await axiosInstance.get("/user/profile");
        setIsOwnProfile(true);
      }

      // console.log("Profile response:", response.data);
      setUser(response.data.user);
      setEditForm({
        fullName: response.data.user.fullName || "",
        role: response.data.user.role || "Professional",
        skillsText: response.data.user.skills || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error && typeof error === "object" && "message" in error) {
        const errorObj = error as {
          message: string;
          response?: { data: unknown; status: number; statusText: string };
        };
        console.error("Error details:", {
          message: errorObj.message,
          response: errorObj.response?.data,
          status: errorObj.response?.status,
          statusText: errorObj.response?.statusText,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to current user data
    if (user) {
      setEditForm({
        fullName: user.fullName || "",
        role: user.role || "Professional",
        skillsText: user.skills || "",
      });
    }
  };

  const handleSave = async () => {
    try {
      // console.log("Save button clicked!");
      // console.log("Current editForm:", editForm);

      const requestData = {
        fullName: editForm.fullName,
        role: editForm.role,
        skills: editForm.skillsText,
      };

      // console.log("Sending request data:", requestData);

      const response = await axiosInstance.put("/user/profile", requestData);

      // console.log("Save response:", response.data);

      setUser(response.data.user);
      setIsEditing(false);
      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error && typeof error === "object" && "response" in error) {
        const errorObj = error as {
          response?: { data: unknown; status: number; statusText: string };
        };
        console.error("Error response:", errorObj.response);
      }
    }
  };

  if (loading) {
    return <div className="app-container">Loading...</div>;
  }

  if (!user) {
    return <div className="app-container">User not found</div>;
  }

  return (
    <div className="app-container">
      {/* Main content card */}
      <div className="profile-card">
        {/* Sidebar */}
        <div className="sidebar">
          {/* Profile Picture */}
          <div className="profile-pic-container">
            <img src={profilePic} alt="Profile" className="profile-pic" />
          </div>

          {/* User Name */}
          <h2 className="user-name-sidebar">{user.fullName}</h2>
          <br />
          <br />

          {/* Navigation Links */}
          <nav className="nav-menu">
            <ul className="nav-list">
              <li>
                <a href="./home">Home</a>
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

          {/* Skills Section */}
          <div className="skills-section">
            <h2 className="section-heading">Skills</h2>
            <div className="skills-text" style={{ whiteSpace: "pre-wrap" }}>
              {user.skills || "No skills provided"}
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
              <label>Skills:</label>
              <textarea
                value={editForm.skillsText}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    skillsText: e.target.value,
                  }))
                }
              />
            </div>

            <div className="modal-buttons">
              <button onClick={handleSave} className="save-btn">
                Save
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
