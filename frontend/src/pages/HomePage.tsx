import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css';

interface UserStats {
  collectionCount: number;
  wantlistCount: number;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    collectionCount: 0,
    wantlistCount: 0
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleViewCollection = () => {
    navigate('/collection');
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('HomePage - Fetching stats with token:', token ? `${token.substring(0, 20)}...` : 'No token');
      
      const response = await fetch('http://localhost:3001/api/user/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('HomePage - Stats response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('HomePage - Stats data:', data);
        setStats(data);
      } else {
        console.error('HomePage - Stats fetch failed:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="header-content">
          <h1>Discogs Clone</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="homepage-main">
        <div className="user-section">
          <h2>Welcome back, {user?.firstName || user?.username}!</h2>
          <div className="user-details">
            <p>
              <strong>Username:</strong> {user?.username}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Account Type:</strong> {user?.role}
            </p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>My Collection</h3>
            <p>{stats.collectionCount} releases</p>
            <button className="card-action" onClick={handleViewCollection}>View Collection</button>
          </div>

          <div className="dashboard-card">
            <h3>Wantlist</h3>
            <p>{stats.wantlistCount} items</p>
            <button className="card-action">View Wantlist</button>
          </div>

          <div className="dashboard-card">
            <h3>For Sale</h3>
            <p>0 listings</p>
            <button className="card-action">Manage Listings</button>
          </div>

          <div className="dashboard-card">
            <h3>Orders</h3>
            <p>0 orders</p>
            <button className="card-action">View Orders</button>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn primary">Browse Music</button>
            <button className="action-btn">Add Release</button>
            <button className="action-btn">Search Marketplace</button>
            <button className="action-btn">Community Forums</button>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <p className="no-activity">No recent activity</p>
          </div>
        </div>
      </main>
    </div>
  );
}
