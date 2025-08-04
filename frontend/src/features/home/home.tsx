import { useState } from 'react';
import { searchUsersApi } from '../../shared/config/api';
import './home.css';


interface User {
  _id: string;
  username: string;
  email: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
 

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await searchUsersApi(searchQuery);
      setSearchResults(response.data.users || []);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="prosearch-home">
      {/* Navigation Bar */}
      <header>
        <div className="container-nav">
          <div className="logo">ProSearch</div>
          <nav>
            <ul>
              <li><a href="../profile">Account</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Search Section */}
      <section className="search-section">
        <h1>Find the right professional for your needs</h1>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search for engineers, designers, developers..." 
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyPress={handleSearchKeyPress}
          />
          <button onClick={handleSearch}>
            Search
          </button>
        </div>
      </section>

      {/* Search Results */}
      
        <section className="search-results">
          <div className="container">
            <h2>Search Results</h2>
            <div className="results-grid"> 
              {searchResults.map((user) => (
                <div key={user._id} className="result-card">
                  <h3>{user.username}</h3>
                  <p>Professional</p>
                </div>
              ))}
            </div>
          </div>
        </section>

       

      {/* footer */}
      <footer>
        <p>&copy; 2025 ProSearch. All rights reserved.</p>
      </footer>
    </div>
  );
}
