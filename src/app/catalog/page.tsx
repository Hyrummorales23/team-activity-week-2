import MainLayout from '@/components/Layout/MainLayout';
import Sidebar from '@/components/Sidebar/Sidebar';
import Link from 'next/link';
import styles from './catalog.module.css';
import { searchItems } from "@/lib/queries/items";

export default async function CatalogPage({ 
  searchParams,
 }: { 
  searchParams: { search?: string };
 }) {
  const searchQuery = searchParams.search || "";
  
  //Fetch items based on search
  const products = searchQuery
  ? await searchItems(searchQuery): []; // later can replace [] with getAllItems()

  return (
    <MainLayout showSidebar sidebar={<Sidebar />}>
      <div className={styles.catalogPage}>
        
        {/* Search Bar */}
        <form action="/catalog" method="GET" className={styles.searchSection}>
          <input
            type="text"
            name="search"
            placeholder="Search for handcrafted items..."
            defaultValue={searchQuery}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>

        {/* Filters */}
        <div className={styles.filters}>
          <h3 className={styles.filtersTitle}>Filters</h3>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Price Range</label>
            <select className={styles.filterSelect}>
              <option>All Prices</option>
              <option>Under $25</option>
              <option>$25 - $50</option>
              <option>$50 - $100</option>
              <option>Over $100</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sort By</label>
            <select className={styles.filterSelect}>
              <option>Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
              <option>Most Popular</option>
            </select>
          </div>
        </div>

        {/* Product Grid Placeholder */}
        <div className={styles.productsSection}>
          <h2 className={styles.sectionTitle}>All Products</h2>
          <div className={styles.productGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className={styles.productCard}>
                <div className={styles.productImage}>
                  <span className={styles.placeholder}>📦</span>
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>Product Name</h3>
                  <p className={styles.productArtisan}>By Artisan Name</p>
                  <div className={styles.productFooter}>
                    <span className={styles.productPrice}>$XX.XX</span>
                    <span className={styles.productRating}>⭐ 4.5</span>
                  </div>
                  <Link href="/products/edit" className={styles.editButton}>
                    ✏️ Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
