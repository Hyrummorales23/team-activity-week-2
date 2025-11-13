import styles from './artisans.module.css';

export default function ArtisansPage() {
  return (
    <div className={styles.artisansPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Featured Artisans</h1>
        <p className={styles.subtitle}>
          Meet the talented creators behind our handcrafted products
        </p>
      </div>

      <div className={styles.artisanGrid}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className={styles.artisanCard}>
            <div className={styles.artisanAvatar}>
              <span className={styles.placeholder}>👤</span>
            </div>
            <h3 className={styles.artisanName}>Artisan Name</h3>
            <p className={styles.artisanBio}>
              Brief description of the artisan and their craft...
            </p>
            <div className={styles.artisanStats}>
              <span>✨ XX Products</span>
              <span>⭐ 4.8 Rating</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
