'use client';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import styles from './login.module.css';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (result?.error) {
      setError('Invalid email or password.');
    } else {
      window.location.href = '/profile';
    }
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

          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
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
