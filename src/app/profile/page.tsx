'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // Import for useSession
import styles from './profile.module.css';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const userType = (session?.user as any)?.type;
  useEffect(() => {
    console.log('Session:', session);
    console.log('Status:', status);
  }, [session, status]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('User Name');
  const [email, setEmail] = useState('user@example.com');
  const [bio, setBio] = useState('Brief bio about the user...');
  const [location, setLocation] = useState('City, Country');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userId = session && session.user ? (session.user as any).id : undefined;
    if (status === 'authenticated' && userId) {
      setUserId(userId);
      // Fetch user profile data from backend
      fetch(`/api/users?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.name) setName(data.name);
          if (data && data.email) setEmail(data.email);
          // Optionally: set bio, location, phone if available
        });
    }
  }, [status, session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    if (!userId) {
      setMessage('No user ID found. Please log in.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name,
          email,
          profilePicture: '', // Add image upload logic if needed
          type: 'customer', // Or 'seller', make dynamic if needed
        })
      });
      if (res.ok) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setMessage('Failed to update profile.');
      }
    } catch (err) {
      setMessage('Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values (would come from API)
    setIsEditing(false);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2>You must be logged in to view your profile.</h2>
        <a href="/login" style={{ color: '#C26D3D', fontWeight: 600 }}>Go to Login</a>
      </div>
    );
  }

  if (userType === 'seller') {
    // Seller/Artisan view
    return (
      <div className={styles.profilePage}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              <span className={styles.placeholder}>🧑‍🎨</span>
            </div>
            {isEditing && (
              <button className={styles.btnSecondary}>Change Photo</button>
            )}
          </div>
          <div className={styles.profileInfo}>
            {isEditing ? (
              <input
                type="text"
                className={styles.nameInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <h1 className={styles.profileName}>{name}</h1>
            )}
            <p className={styles.profileType}>Artisan/Seller Account</p>
            <p className={styles.memberSince}>Member since November 2025</p>
            {!isEditing && (
              <button 
                className={styles.btnEdit}
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            )}
            {/* Add Product Button */}
            {!isEditing && (
              <a href="/products/new" className={styles.btnPrimary} style={{marginLeft: '1rem'}}>➕ Add Product</a>
            )}
          </div>
        </div>
        <div className={styles.profileContent}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>My Products</h2>
            <div className={styles.placeholder}>
              <p>Your listed products will appear here</p>
            </div>
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Sales</h2>
            <div className={styles.placeholder}>
              <p>Your sales history will appear here</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Customer view (default)
  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            <span className={styles.placeholder}>👤</span>
          </div>
          {isEditing && (
            <button className={styles.btnSecondary}>Change Photo</button>
          )}
        </div>
        <div className={styles.profileInfo}>
          {isEditing ? (
            <input
              type="text"
              className={styles.nameInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <h1 className={styles.profileName}>{name}</h1>
          )}
          <p className={styles.profileType}>Customer Account</p>
          <p className={styles.memberSince}>Member since November 2025</p>
          {!isEditing && (
            <button 
              className={styles.btnEdit}
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>
      </div>
      <div className={styles.profileContent}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Account Information</h2>
          <form className={styles.form} onSubmit={handleSave}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input 
                  type="email" 
                  className={styles.input} 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Location</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  disabled={!isEditing}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Phone (Optional)</label>
                <input 
                  type="tel" 
                  className={styles.input} 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Bio</label>
              <textarea 
                className={styles.textarea}
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                disabled={!isEditing}
              />
            </div>
            {isEditing && (
              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.btnCancel}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Save Changes
                </button>
              </div>
            )}
          </form>
          {message && <div style={{ margin: '1rem 0', color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>My Orders</h2>
          <div className={styles.placeholder}>
            <p>Your order history will appear here</p>
          </div>
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Favorites</h2>
          <div className={styles.placeholder}>
            <p>Your favorite products will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
