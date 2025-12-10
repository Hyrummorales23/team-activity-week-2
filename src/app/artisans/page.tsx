"use client";
import styles from './artisans.module.css';
import { useEffect, useState } from 'react';

type Artisan = {
  userId: string;
  name: string;
  email: string;
  type: string;
  profilePicture: string;
};

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setArtisans(data.filter((user: Artisan) => user.type === 'seller'));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load artisans.');
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.artisansPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Featured Artisans</h1>
        <p className={styles.subtitle}>
          Meet the talented creators behind our handcrafted products
        </p>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className={styles.artisanGrid}>
          {artisans.length === 0 ? (
            <div>No artisans found.</div>
          ) : (
            artisans.map((artisan, idx) => (
              <div key={artisan.userId || artisan.email || idx} className={styles.artisanCard}>
                <div className={styles.artisanAvatar}>
                  <span className={styles.placeholder}>👤</span>
                </div>
                <h3 className={styles.artisanName}>{artisan.name}</h3>
                <p className={styles.artisanBio}>
                  {/* You can add a real bio field if available */}
                  {artisan.email}
                </p>
                <div className={styles.artisanStats}>
                  <span>✨ Products</span>
                  <span>⭐ Rating</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
