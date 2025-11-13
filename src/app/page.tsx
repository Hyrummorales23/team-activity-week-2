import Link from 'next/link';
import styles from './home.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Discover Unique Handcrafted Treasures
          </h1>
          <p className={styles.heroSubtitle}>
            Support talented artisans and find one-of-a-kind pieces made with passion and skill
          </p>
          <div className={styles.heroActions}>
            <Link href="/catalog" className={styles.btnPrimary}>
              Browse Catalog
            </Link>
            <Link href="/artisans" className={styles.btnSecondary}>
              Meet Artisans
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Popular Categories</h2>
        <div className={styles.categoryGrid}>
          {[
            { name: 'Ceramics', icon: '🏺', slug: 'ceramics' },
            { name: 'Textiles', icon: '🧵', slug: 'textiles' },
            { name: 'Woodwork', icon: '🪵', slug: 'woodwork' },
            { name: 'Jewelry', icon: '💍', slug: 'jewelry' },
          ].map((category) => (
            <Link
              key={category.slug}
              href={`/catalog?category=${category.slug}`}
              className={styles.categoryCard}
            >
              <span className={styles.categoryIcon}>{category.icon}</span>
              <span className={styles.categoryName}>{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Placeholder Sections */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Highest Rated Items</h2>
        <div className={styles.placeholder}>
          <p>Product listings will appear here</p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Latest Arrivals</h2>
        <div className={styles.placeholder}>
          <p>New products will appear here</p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Top Sellers</h2>
        <div className={styles.placeholder}>
          <p>Featured artisans will appear here</p>
        </div>
      </section>
    </div>
  );
}

// Team Members:
// - Hyrum Morales
// - Samuel Riveros
// - Lifegate Justice
// - Boitumelo Meletse
// - Uchechukwu Promise
// - Happiness Ncube

