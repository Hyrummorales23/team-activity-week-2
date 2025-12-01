'use client';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../login/login.module.css';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: any) {
    e.preventDefault();
    const password = e.target.password.value;

    const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/g;

    if (password.length < 8) {
      return setError("Password must be at least 8 characters long.");
    }
    if (!symbolRegex.test(password)) {
      return setError("Password must contain at least 1 symbol.");
    }

    setError('');
    alert('Account created (front-end only)');
  }

  return (
    <div className={styles.pageBackground}>
      <div className={styles.glassCard}>
        <h1 className={styles.title}>Artisan Market</h1>
        <p className={styles.subtitle}>Create your account</p>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input type="text" placeholder="Enter your name" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input type="email" placeholder="your@email.com" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>

            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Create a password"
                className={styles.input}
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>I am a...</label>
            <select className={styles.input} required>
              <option value="">Select account type</option>
              <option value="customer">Customer</option>
              <option value="artisan">Artisan/Seller</option>
            </select>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btnPrimary}>Create Account</button>
        </form>

        <div className={styles.divider}><span>or continue with</span></div>

        <div className={styles.socialButtons}>
          <button className={styles.googleBtn}>Google</button>
          <button className={styles.facebookBtn}>Facebook</button>
        </div>

        <div className={styles.registerPrompt}>
          <p>Already have an account?</p>
          <Link href="/login" className={styles.registerLink}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
