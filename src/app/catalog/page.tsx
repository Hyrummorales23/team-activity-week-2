import MainLayout from '@/components/Layout/MainLayout';
import Sidebar from '@/components/Sidebar/Sidebar';
import Link from 'next/link';
import styles from './catalog.module.css';
import { searchItems, getAllItems } from "@/lib/queries/items";

export default async function CatalogPage(props: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search = "" } = await props.searchParams;

  // Fetch items based on search
  const products = search
    ? await searchItems(search)
    : await getAllItems();

  return (
    <MainLayout showSidebar sidebar={<Sidebar />}>
      <div className={styles.catalogPage}>
        
        {/* Search Bar */}
        <form action="/catalog" method="GET" className={styles.searchSection}>
          <input
            type="text"
            name="search"
            placeholder="Search for handcrafted items..."
            defaultValue={search}
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

        {/* Products */}
        <div className={styles.productsSection}>
          <h2 className={styles.sectionTitle}>All Products</h2>

          <div className={styles.productGrid}>
            {products.length === 0 && (
              <p>No items found. Try another search.</p>
            )}

            {products.map((item: any) => (
              <div key={item.itemid} className={styles.productCard}>
                <div className={styles.productImage}>
                  {item.product_picture ? (
                    <img
                      src={item.product_picture}
                      alt={item.product_name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span className={styles.placeholder}>📦</span>
                  )}
                </div>

                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{item.product_name}</h3>
                  <p className={styles.productArtisan}>
                    By {item.artisan_name || "Unknown"}
                  </p>

                  <div className={styles.productFooter}>
                    <span className={styles.productPrice}>
                      ${(item.product_price / 100).toFixed(2)}
                    </span>

                    <span className={styles.productRating}>
                      ⭐ {Number(item.average_rating || 0).toFixed(1)}
                    </span>
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