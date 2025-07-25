import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './CollectionPage.css';

interface Artist {
  id: string;
  artist: {
    id: string;
    name: string;
  };
}

interface Release {
  id: string;
  title: string;
  catalogNumber?: string;
  releaseDate?: string;
  artists: Artist[];
  label?: {
    id: string;
    name: string;
  };
  format: {
    id: string;
    name: string;
  };
}

interface CollectionItem {
  id: string;
  release: Release;
  condition: string;
  rating?: number;
  notes?: string;
  addedAt: string;
}

export default function CollectionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<'artist' | 'title' | 'added'>('artist');
  const [filterCondition, setFilterCondition] = useState<string>('all');

  useEffect(() => {
    fetchCollection();
  }, []);

  const fetchCollection = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching collection with token:', token ? `${token.substring(0, 20)}...` : 'No token');
      
      const response = await fetch('http://localhost:3001/api/collection', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Collection response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Collection fetch error:', errorData);
        throw new Error('Failed to fetch collection');
      }

      const data = await response.json();
      console.log('Collection data:', data);
      setCollection(data.items || []);
    } catch (err) {
      console.error('Collection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load collection');
    } finally {
      setLoading(false);
    }
  };

  const getArtistNames = (item: CollectionItem) => {
    return item.release.artists
      .map(a => a.artist.name)
      .join(', ');
  };

  const formatCondition = (condition: string) => {
    return condition.replace(/_/g, ' ');
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'star filled' : 'star'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  // Sort collection
  const sortedCollection = [...collection].sort((a, b) => {
    switch (sortBy) {
      case 'artist':
        return getArtistNames(a).localeCompare(getArtistNames(b));
      case 'title':
        return a.release.title.localeCompare(b.release.title);
      case 'added':
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      default:
        return 0;
    }
  });

  // Filter collection
  const filteredCollection = filterCondition === 'all' 
    ? sortedCollection 
    : sortedCollection.filter(item => item.condition === filterCondition);

  // Get unique conditions for filter
  const conditions = ['all', ...new Set(collection.map(item => item.condition))];

  if (loading) {
    return (
      <div className="collection-page">
        <div className="loading">Loading your collection...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="collection-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="collection-page">
      <header className="collection-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate('/home')}>
              ← Back to Dashboard
            </button>
            <h1>My Collection</h1>
          </div>
          <div className="collection-stats">
            <span>{filteredCollection.length} records</span>
          </div>
        </div>
      </header>

      <div className="collection-controls">
        <div className="sort-control">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="artist">Artist</option>
            <option value="title">Title</option>
            <option value="added">Date Added</option>
          </select>
        </div>

        <div className="filter-control">
          <label>Condition:</label>
          <select value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)}>
            {conditions.map(condition => (
              <option key={condition} value={condition}>
                {condition === 'all' ? 'All' : formatCondition(condition)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="collection-grid">
        {filteredCollection.map((item) => (
          <div key={item.id} className="collection-item">
            <div className="album-cover">
              <div className="placeholder-cover">
                <span>No Image</span>
              </div>
            </div>
            
            <div className="item-details">
              <h3 className="artist-name">{getArtistNames(item)}</h3>
              <h4 className="album-title">{item.release.title}</h4>
              
              <div className="item-meta">
                {item.release.label && (
                  <p className="label">{item.release.label.name}</p>
                )}
                <p className="format">{item.release.format.name}</p>
                {item.release.releaseDate && (
                  <p className="year">{item.release.releaseDate}</p>
                )}
                {item.release.catalogNumber && (
                  <p className="catalog">Cat# {item.release.catalogNumber}</p>
                )}
              </div>

              <div className="item-condition">
                <span className={`condition condition-${item.condition.toLowerCase()}`}>
                  {formatCondition(item.condition)}
                </span>
              </div>

              {renderStars(item.rating)}
              
              {item.notes && (
                <p className="notes">{item.notes}</p>
              )}

              <p className="added-date">
                Added {new Date(item.addedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredCollection.length === 0 && (
        <div className="empty-state">
          <p>No records found matching your filters.</p>
        </div>
      )}
    </div>
  );
}