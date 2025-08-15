import "./profile.css";
import profilePic from "../../assets/profile-pic.jpg";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../shared/config/axiosinstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  //TS way of defining structure of oject
  _id: string;
  username: string;
  fullName: string;
  role: string;
  skills: string;
}

interface EditFormData {
  fullName: string;
  role: string;
  skillsText: string;
}

function Profile() {
  const navigate = useNavigate(); //react router hook-route to another page
  const { userId } = useParams(); // react router hook-get variable from url
  const [user, setUser] = useState<User | null>(null); //user exits or null and default null
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

  // fetch data from backend
  const fetchUserProfile = async () => {
    let response;
    if (userId) {
      // Fetching another user's profile
      response = await axiosInstance.get(`/user/user/${userId}`);
      setIsOwnProfile(false);
    } else {
      // Fetching own profile
      response = await axiosInstance.get("/user/profile");
      setIsOwnProfile(true);
    }

    // Get logged-in username from localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    setUser(response.data.user); // store user data from backend to useState
    setEditForm({
      //initialize or update the form used for editing profile
      fullName: response.data.user.fullName || currentUser?.username || "",
      role: response.data.user.role || "Professional",
      skillsText: response.data.user.skills || "",
    });

    setLoading(false);
  };

  const handleLogout = () => {
    // Clears the authentication token and the stored user info from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handleEdit = () => {
    // triggers the edit modal to appear
    setIsEditing(true);
  };

  const handleCancel = () => {
    //Closes the edit modal
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

  //Sends a PUT request to update the profile on the backend
  const handleSave = async () => {
    // Collects the data from the edit form into requestData
    const requestData = {
      fullName: editForm.fullName,
      role: editForm.role,
      skills: editForm.skillsText,
    };

    const response = await axiosInstance.put("/user/profile", requestData); //Sends an HTTP PUT request to the endpoint
    setUser(response.data.user); //Updates the user state with the newly updated profile
    setIsEditing(false);
    toast.success("Profile updated sucessfully");
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
