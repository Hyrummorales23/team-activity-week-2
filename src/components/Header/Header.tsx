import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🎨</span>
          <span className={styles.logoText}>Artisan Marketplace</span>
        </Link>

        {/* Navigation Links */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/catalog" className={styles.navLink}>
            Catalog
          </Link>
          <Link href="/artisans" className={styles.navLink}>
            Artisans
          </Link>
        </nav>

        {/* User Actions */}
        <div className={styles.actions}>
          <Link href="/login" className={styles.btnSecondary}>
            Login
          </Link>
          <Link href="/register" className={styles.btnPrimary}>
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
