'use client';
import Link from 'next/link';
import { useState } from 'react';
import styles from './login.module.css';

export default function LoginPage() {
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
      return setError("Password must include at least 1 symbol.");
    }

    setError('');
    alert("Login successful (front-end only)");
  }

  return (
    <div className={styles.pageBackground}>
      <div className={styles.glassCard}>
        <h1 className={styles.title}>Artisan Market</h1>
        <p className={styles.subtitle}>Welcome back! Sign in to your account</p>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input type="email" id="email" placeholder="Enter your email" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
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

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.formOptions}>
            <Link href="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
          </div>

          <button type="submit" className={styles.btnPrimary}>Sign In</button>
        </form>

        <div className={styles.divider}><span>or continue with</span></div>

        <div className={styles.socialButtons}>
          <button className={styles.googleBtn}>Google</button>
          <button className={styles.facebookBtn}>Facebook</button>
        </div>

        <div className={styles.registerPrompt}>
          <p>Don&apos;t have an account?</p>
          <Link href="/register" className={styles.registerLink}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
