'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './profile.module.css';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('User Name');
  const [email, setEmail] = useState('user@example.com');
  const [bio, setBio] = useState('Brief bio about the user...');
  const [location, setLocation] = useState('City, Country');
  const [phone, setPhone] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to API to save profile
    setIsEditing(false);
    alert('Profile updated! (This will connect to your API endpoint)');
  };

  const handleCancel = () => {
    // Reset to original values (would come from API)
    setIsEditing(false);
  };

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
