import Link from 'next/link';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeCategory?: string;
}

export default function Sidebar({ activeCategory }: SidebarProps) {
  const categories = [
    { name: 'All Products', slug: 'all', icon: '🏪' },
    { name: 'Ceramics', slug: 'ceramics', icon: '🏺' },
    { name: 'Textiles', slug: 'textiles', icon: '🧵' },
    { name: 'Woodwork', slug: 'woodwork', icon: '🪵' },
    { name: 'Jewelry', slug: 'jewelry', icon: '💍' },
    { name: 'Metalwork', slug: 'metalwork', icon: '⚒️' },
    { name: 'Glasswork', slug: 'glasswork', icon: '🫙' },
    { name: 'Leather Goods', slug: 'leather', icon: '👜' },
    { name: 'Paper Crafts', slug: 'paper', icon: '📄' },
    { name: 'Pottery', slug: 'pottery', icon: '🏺' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3 className={styles.title}>Categories</h3>
      </div>

      <nav className={styles.categoryList}>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/catalog?category=${category.slug}`}
            className={`${styles.categoryItem} ${
              activeCategory === category.slug ? styles.active : ''
            }`}
          >
            <span className={styles.categoryIcon}>{category.icon}</span>
            <span className={styles.categoryName}>{category.name}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.divider}></div>

      <div className={styles.filterSection}>
        <h4 className={styles.filterTitle}>Quick Filters</h4>
        <div className={styles.filterOptions}>
          <Link href="/catalog?filter=new" className={styles.filterLink}>
            ⭐ New Arrivals
          </Link>
          <Link href="/catalog?filter=popular" className={styles.filterLink}>
            🔥 Popular Items
          </Link>
          <Link href="/catalog?filter=sale" className={styles.filterLink}>
            💰 On Sale
          </Link>
          <Link href="/catalog?filter=featured" className={styles.filterLink}>
            ✨ Featured Artisans
          </Link>
        </div>
      </div>
    </aside>
  );
}
