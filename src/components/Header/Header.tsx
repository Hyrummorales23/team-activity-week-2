'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styles from './Header.module.css';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className={styles.header}>
      <div className={styles.container}>

        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🎨</span>
          <span className={styles.logoText}>Artisan Marketplace</span>
        </Link>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/catalog" className={styles.navLink}>Catalog</Link>
          <Link href="/artisans" className={styles.navLink}>Artisans</Link>
        </nav>

        {/* User Actions */}
        <div className={styles.actions}>
          {status === "loading" && (
            <div className={styles.loadingIndicator}>...</div>
          )}

          {status === "unauthenticated" && (
            <>
              <Link href="/login" className={styles.btnSecondary}>
                Login
              </Link>
              <Link href="/register" className={styles.btnPrimary}>
                Sign Up
              </Link>
            </>
          )}

          {status === "authenticated" && (
            <Link href="/profile" className={styles.btnPrimary}>
              {session?.user?.name?.split(' ')[0] + ' Profile' || "Profile"}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}