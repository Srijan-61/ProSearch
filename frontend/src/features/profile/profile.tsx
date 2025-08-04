import './profile.css';
import profilePic from '../../assets/profile-pic.jpg';
import { useNavigate } from 'react-router-dom';

function Profile() {
     const navigate = useNavigate();

     const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    

    <div className="app-container">
      {/* Main content card */}
      <div className="profile-card">
        {/* Sidebar */}
        <div className="sidebar">
          {/* Profile Picture */}
          <div className="profile-pic-container">
            <img src={profilePic} alt="Profile" className="profile-pic"/>
          </div>

          {/* User Name */}
          <h2 className="user-name-sidebar">Srijan Bhandari</h2>

          {/* Frontend Developer Role */}
          <p className="role-sidebar">Frontend Developer</p>

          {/* Navigation Links */}
          <nav className="nav-menu">
            <ul className="nav-list">
              {/* Logout Button */}
              <li>
                <a href="./home">Home</a>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-button ">Logout</button>
              </li>
              
            </ul>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          <h1 className="user-name-main">Srijan Bhandari</h1>
          <p className="role-main">Frontend Developer</p>

          {/* Skills Section */}
          <div className="skills-section">
            <h2 className="section-heading">Skills</h2>
            <div className="skills-grid">
              <div className="skill-item">
                <h3 className="skill-title">HTML & CSS</h3>
                <p className="skill-description">HTML, Responsive Design (Flexbox, Grid)</p>
              </div>
              <div className="skill-item">
                <h3 className="skill-title">JavaScript (ES6+)</h3>
                <p className="skill-description">DOM Manipulation, Asynchronous JS, API Integration</p>
              </div>
              <div className="skill-item">
                <h3 className="skill-title">React.js</h3>
                <p className="skill-description">Hooks, Context API, Component Lifecycle, Routing</p>
              </div>
              <div className="skill-item">
                <h3 className="skill-title">Version Control</h3>
                <p className="skill-description">Git, GitHub/GitLab workflows</p>
              </div>
              <div className="skill-item">
                <h3 className="skill-title">UI/UX Principles</h3>
                <p className="skill-description">User-centered design, Accessibility, Wireframing</p>
              </div>
              <div className="skill-item">
                <h3 className="skill-title">Tools & Libraries</h3>
                <p className="skill-description">Webpack, Babel, npm/yarn</p>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="projects-section">
            <h2 className="section-heading">Projects</h2>
            <ul className="projects-list">
              <li>E-commerce Storefront (React, Redux, Stripe Integration)</li>
              <li>Interactive Data Visualization Dashboard (React, D3.js)</li>
              <li>Personal Portfolio Website (HTML, CSS, JavaScript)</li>
              <li>Task Management Application (React, Firebase Firestore)</li>
              <li>Responsive Blog Layout (HTML, CSS)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
