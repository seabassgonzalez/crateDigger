import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LandingPage.css';

interface FeaturedRelease {
  id: string;
  title: string;
  artist: string;
  year: string;
  genre: string;
  format: string;
  price: string;
  copies: string;
  imageUrl?: string;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredArticles = [
    "Social Picks: The Best Records of 2025 So Far",
    "The Albums That Defined IDM", 
    "Brazilian Albums That Shaped Modern Music",
    "Most Valuable Records Sold In June",
    "This Week's Top Selling Vinyl Records & CDs"
  ];

  const featuredReleases: FeaturedRelease[] = [
    {
      id: '1',
      title: 'Moisturizer',
      artist: 'Wet Leg',
      year: '2025',
      genre: 'Indie Rock',
      format: 'Vinyl, Album, Limited Edition',
      price: '$27.98',
      copies: '25 copies from'
    },
    {
      id: '2', 
      title: "Live Dans L'Sud De Paris",
      artist: 'Tetrips',
      year: '2025',
      genre: 'Freetekno',
      format: 'Vinyl, Album, Picture Disc',
      price: '$63.95',
      copies: '1 copy from'
    },
    {
      id: '3',
      title: 'Alright (The Sasha Mixes)',
      artist: 'Urban Soul',
      year: '1991',
      genre: 'Garage House',
      format: 'Vinyl',
      price: '$2.00',
      copies: '33 copies from'
    },
    {
      id: '4',
      title: 'Paranoid',
      artist: 'Black Sabbath',
      year: '2025',
      genre: 'Hard Rock, Heavy Metal',
      format: 'Vinyl, Album, Limited Edition, Reissue',
      price: '$42.99',
      copies: '13 copies from'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search for:', searchQuery);
    // TODO: Implement search functionality
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleDashboard = () => {
    navigate('/home');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-top">
          <div className="header-container">
            <div className="logo">
              <h1>Discogs</h1>
            </div>
            <nav className="main-nav">
              <a href="#explore">Explore</a>
              <a href="#marketplace">Marketplace</a>
              <a href="#community">Community</a>
            </nav>
            <div className="header-actions">
              {isAuthenticated ? (
                <>
                  <span className="username-display">Hi, {user?.username}</span>
                  <button className="dashboard-btn" onClick={handleDashboard}>Dashboard</button>
                </>
              ) : (
                <>
                  <button className="sign-in-btn" onClick={handleSignIn}>Sign In</button>
                  <button className="register-btn" onClick={handleRegister}>Register</button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-container">
            <h2 className="hero-title">Discogs</h2>
            <p className="hero-subtitle">Music Database and Marketplace</p>
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search artists, albums, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">Search</button>
              </div>
            </form>
          </div>
        </section>

        <section className="featured-articles">
          <div className="section-container">
            <div className="articles-grid">
              {featuredArticles.map((article, index) => (
                <a key={index} href="#" className="article-link">
                  {article}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="featured-releases">
          <div className="section-container">
            <h3 className="section-title">Recently Listed</h3>
            <div className="releases-grid">
              {featuredReleases.map((release) => (
                <div key={release.id} className="release-card">
                  <div className="release-image">
                    <div className="placeholder-image">
                      <span>No Image</span>
                    </div>
                  </div>
                  <div className="release-info">
                    <h4 className="release-title">{release.title}</h4>
                    <p className="release-artist">{release.artist}</p>
                    <p className="release-year">{release.year}</p>
                    <p className="release-genre">{release.genre}</p>
                    <p className="release-format">{release.format}</p>
                    <p className="release-price">
                      <span className="copies">{release.copies}</span> {release.price}
                    </p>
                    <div className="release-actions">
                      <button className="shop-btn">Shop</button>
                      <button className="want-btn">Want</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="info-section">
          <div className="section-container">
            <div className="info-grid">
              <div className="info-card">
                <h3>Discover Music</h3>
                <p>Explore the world's largest music database with millions of releases from artists around the globe.</p>
              </div>
              <div className="info-card">
                <h3>Build Your Collection</h3>
                <p>Catalog your music collection, track what you have, what you want, and discover new music.</p>
              </div>
              <div className="info-card">
                <h3>Buy & Sell</h3>
                <p>Connect with sellers worldwide in the largest online music marketplace.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-links">
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">API</a>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#">Help & Support</a>
              <a href="#">Forum</a>
              <a href="#">Keyboard Shortcuts</a>
            </div>
            <div className="footer-column">
              <h4>Community</h4>
              <a href="#">Database Guidelines</a>
              <a href="#">Discogs Digs</a>
              <a href="#">Blog</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Discogs Clone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}