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
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await searchUsersApi(searchQuery);
      setSearchResults(response.data.users || []);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
          Find the <span className="highlight">right professional</span> for
          your needs
        </h1>
        <p className="hero-subtext">
          Search and connect with skilled professionals in tech, design, and
          more.
        </p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for engineers, designers, developers..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyPress={handleSearchKeyPress}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </section>

      <section className="search-results">
        <div className="container">
          <h2>Search Results</h2>
          {searchResults.length === 0 ? (
            <p className="no-results">
              No results yet. Try searching for a skill or profession.
            </p>
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
                    <div className="profile-pic">
                      {getInitial(user.username)}
                    </div>
                  </div>
                  <h3>{user.fullName || user.username}</h3>
                  <p className="user-role">{user.role || "Professional"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer>
        <p>&copy; 2025 ProSearch. All rights reserved.</p>
      </footer>
    </div>
  );
}
