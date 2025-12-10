import Link from 'next/link';
import styles from './home.module.css';

export default function Home() {
  const categories = [
    { name: 'Ceramics', icon: '🏺', slug: 'ceramics' },
    { name: 'Textiles', icon: '🧵', slug: 'textiles' },
    { name: 'Woodwork', icon: '🪵', slug: 'woodwork' },
    { name: 'Jewelry', icon: '💍', slug: 'jewelry' },
  ];

  const featuredItems = [
    { title: 'Handcrafted Clay Pot', price: '$42' },
    { title: 'Woven Blanket', price: '$65' },
    { title: 'Wooden Sculpture', price: '$120' },
  ];

  const topSellers = [
    { name: 'Artisan Craftworks' },
    { name: 'Golden Hands Studio' },
    { name: 'Urban Weavers' },
  ];

  return (
    <div className={styles.page}>
      
      {/* Floating Decorations */}
      <div className={styles.shape1}></div>
      <div className={styles.shape2}></div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.glassHero}>
          <h1>Unique. Local. Handcrafted.</h1>
          <p>
            Explore a vibrant marketplace where creativity thrives
            and every piece tells a story.
          </p>
          <div className={styles.actions}>
            <Link href="/catalog" className={styles.btnPrimary}>Shop Now</Link>
            <Link href="/artisans" className={styles.btnOutline}>Meet Artisans</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.section}>
        <h2>Explore Categories</h2>
        <p className={styles.sectionSubtitle}>
          Find the perfect handmade creation across a wide variety of crafts.
        </p>
        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog?category=${cat.slug}`}
              className={styles.categoryCard}
            >
              <span className={styles.icon}>{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.section}>
        <h2>Highest Rated Items</h2>
        <div className={styles.cardGrid}>
          {featuredItems.map((item, i) => (
            <div key={i} className={styles.itemCard}>
              <div className={styles.imgPlaceholder}>🌟</div>
              <h3>{item.title}</h3>
              <p className={styles.price}>{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className={styles.section}>
        <h2>Latest Arrivals</h2>
        <div className={styles.arrivals}>
          <p>New products are being added!</p>
        </div>
      </section>

      {/* Top Sellers */}
      <section className={styles.section}>
        <h2>Top Sellers</h2>
        <div className={styles.sellerGrid}>
          {topSellers.map((seller, i) => (
            <div key={i} className={styles.sellerCard}>
              <div className={styles.imgPlaceholder}>👤</div>
              <p>{seller.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className={styles.section}>
        <div className={styles.becomeArtisan}>
          <h2>Become an Artisan</h2>
          <p>Join a growing community of skilled creators and start selling your craft.</p>
          <Link href="/register" className={styles.btnPrimary}>Start Selling</Link>
        </div>
      </section>

    </div>
  );
}
