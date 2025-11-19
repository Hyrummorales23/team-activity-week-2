import Link from 'next/link';
import styles from '../login/login.module.css';

export default function RegisterPage() {
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join our artisan community</p>
        </div>

        <form className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="your@email.com"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Create a password"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="userType" className={styles.label}>
              I am a...
            </label>
            <select id="userType" className={styles.input}>
              <option value="">Select account type</option>
              <option value="customer">Customer</option>
              <option value="artisan">Artisan/Seller</option>
            </select>
          </div>

          <button type="submit" className={styles.btnPrimary}>
            Create Account
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <div className={styles.registerPrompt}>
          <p>Already have an account?</p>
          <Link href="/login" className={styles.registerLink}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
