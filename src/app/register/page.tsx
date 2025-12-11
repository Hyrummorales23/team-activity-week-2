'use client';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import styles from '../login/login.module.css';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const type = (form.elements.namedItem("type") as HTMLSelectElement).value;

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, type, profilePicture: '' })
    });
    setLoading(false);
    if (res.ok) {
      // Auto-login after registration
      await signIn('credentials', { email, password, callbackUrl: '/profile' });
    } else {
      const data = await res.json();
      setError(data.error || 'Registration failed.');
    }
  }

  return (
    <div className={styles.pageBackground}>
      <div className={styles.glassCard}>
        <h1 className={styles.title}>Artisan Market</h1>
        <p className={styles.subtitle}>Create your account</p>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input name='name' type="text" placeholder="Enter your name" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input name='email' type="email" placeholder="your@email.com" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>

            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name='password'
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
            <select name='type' className={styles.input} required>
              <option value="">Select account type</option>
              <option value="customer">Customer</option>
              <option value="seller">Artisan/Seller</option>
            </select>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
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
