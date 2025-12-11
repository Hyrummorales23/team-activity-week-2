"use client";
import styles from './artisans.module.css';
import { useEffect, useState } from 'react';

type Artisan = {
  userid: string;
  name: string;
  email: string;
  type: string;
  profilepicture: string;
  total_items: string;
  average_rating: string;
};

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/users/artisans')
      .then(res => res.json())
      .then(data => {
        setArtisans(data);
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
              <div key={artisan.userid || artisan.email || idx} className={styles.artisanCard}>
                <div className={styles.artisanAvatar}>
                  {artisan.profilepicture ? (
                    <img
                      src={artisan.profilepicture}
                      alt={artisan.name}
                      className={styles.artisanImage}
                    />
                  ) : (
                    <span className={styles.placeholder}>👤</span>
                  )}
                </div>

                <h3 className={styles.artisanName}>{artisan.name}</h3>
                <p className={styles.artisanBio}>{artisan.email}</p>

                <div className={styles.artisanStats}>
                  <div className={styles.statBlock}>
                    <span>✨ Products</span>
                    <span className={styles.statNumber}>{artisan.total_items || 0}</span>
                  </div>
                  <div className={styles.statBlock}>
                    <span>⭐ Rating</span>
                    <span className={styles.statNumber}>{artisan.average_rating || "N/A"}</span>
                  </div>
                </div>

                <a
                  className={styles.btnPrimary}
                  href={`/catalog?userId=${artisan.userid}`}
                >
                  View Crafts
                </a>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
