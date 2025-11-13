import styles from './profile.module.css';

export default function ProfilePage() {
  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            <span className={styles.placeholder}>👤</span>
          </div>
          <button className={styles.btnSecondary}>Change Photo</button>
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.profileName}>User Name</h1>
          <p className={styles.profileType}>Customer Account</p>
          <p className={styles.memberSince}>Member since November 2025</p>
        </div>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Account Information</h2>
          <form className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input type="text" className={styles.input} placeholder="Your name" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input type="email" className={styles.input} placeholder="your@email.com" />
              </div>
            </div>
            <button type="submit" className={styles.btnPrimary}>
              Save Changes
            </button>
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
