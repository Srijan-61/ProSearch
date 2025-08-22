import { useState } from "react";
import { searchUsersApi } from "../../shared/config/api";
import { useNavigate } from "react-router-dom";
import "./home.css";

interface User {
  _id: string;
  username: string;
  fullName: string;
  role: string;
  bio: string;
  skills: string;
  profilePic?: { url: string; public_id: string };
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setHasSearched(true);
      const response = await searchUsersApi(query);
      setSearchResults(response.data.users || []);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };


  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Reset search state if input is empty
    if (!value.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setIsSearching(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  // user initial for pp
  const getInitial = (fullName: string) => {
    if (!fullName) return "";
    return fullName[0].toUpperCase();
  };

  return (
    <div className="prosearch-home">
      <header className="site-header">
        <div className="container-nav">
          <div className="logo">ProSearch</div>
          <nav>
            <ul>
              <li>
                <a href="../profile">Account</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="search-section">
        <h1 className="hero-title">
          Find the <span className="highlight">perfect match</span> for
          your needs
        </h1>
        <p className="hero-subtext">
          Search and connect with skilled professionals in tech, design, and
          more.
        </p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for Frontend Developer, Backend Developer, UI/UX Designer..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyPress={handleSearchKeyPress}
          />
          <button onClick={() => handleSearch()}>
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
        
        {!hasSearched && (
          <div className="search-suggestions">
            <div className="suggestion-pills">
              <span className="suggestion-pill" onClick={() => {setSearchQuery("Frontend Developer"); handleSearch("Frontend Developer");}}>Frontend Developer</span>
              <span className="suggestion-pill" onClick={() => {setSearchQuery("Backend Developer"); handleSearch("Backend Developer");}}>Backend Developer</span>
              <span className="suggestion-pill" onClick={() => {setSearchQuery("UI/UX Designer"); handleSearch("UI/UX Designer");}}>UI/UX Designer</span>
              <span className="suggestion-pill" onClick={() => {setSearchQuery("Full Stack Developer"); handleSearch("Full Stack Developer");}}>Full Stack Developer</span>
            </div>
          </div>
        )}
      </section>

      {!hasSearched && (
        <section className="welcome-section">
          <div className="container">
            <div className="welcome-content">
              <h2>Welcome to ProSearch</h2>
              <p>Please search above to get results and find skilled professionals.</p>
            </div>
          </div>
        </section>
      )}

      {hasSearched && (
        <section className="search-results">
          <h2>Search Results</h2>
            {searchResults.length === 0 ? (
              <div className="no-results">
                <h3>No Results Found</h3>
                <p>Sorry, we couldn't find any professionals matching "{searchQuery}".</p>
                <p>Try searching with different keywords like:</p>
                <ul>
                  <li>Frontend Developer</li>
                  <li>Backend Developer</li>
                  <li>UI/UX Designer</li>
                  <li>Full Stack Developer</li>
                  <li>Software Engineer</li>
                  <li>Names</li>
                  <li>Different spelling variations</li>
                </ul>
              </div>
            ) : (
              <div className="results-grid">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="result-card"
                    onClick={() => handleUserClick(user._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="profile-pic-container">
                      {user.profilePic?.url ? (
                        <img
                          src={user.profilePic.url}
                          alt="Profile"
                          className="profile-pic-img" />
                      ) : (
                        <div className="profile-pic">
                          {getInitial(user.username)}
                        </div>
                      )}
                    </div>
                    <h3>{user.fullName || user.username}</h3>
                    <p className="user-role">{user.role || "Professional"}</p>
                    <p className="user-bio">{user.bio}</p>
                    <div className="skills-list">
                      {user.skills ? (
                        (() => {
                          const skillArray = user.skills
                            .split(/\n|,/)
                            .map((s) => s.trim())
                            .filter(Boolean);
                          const firstThree = skillArray.slice(0, 3);
                          const remaining = skillArray.length - 3;

                          return (
                            <>
                              {firstThree.map((skill, i) => (
                                <span key={i} className="skill-pill">
                                  {skill}
                                </span>
                              ))}
                              {remaining > 0 && (
                                <span className="skill-pill more-pill">
                                  +{remaining} more
                                </span>
                              )}
                            </>
                          );
                        })()
                      ) : (
                        <span className="skill-pill no-skill">
                          No skills provided
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
        </section>
      )}

      <footer>
        <p>&copy; 2025 ProSearch. All rights reserved.</p>
      </footer>
    </div>
  );
}
