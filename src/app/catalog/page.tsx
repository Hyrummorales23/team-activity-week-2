import MainLayout from '@/components/Layout/MainLayout';
import Sidebar from '@/components/Sidebar/Sidebar';
import styles from './catalog.module.css';
import { searchItems, getAllItems, Product, getAllItemsByCategory, getFilteredItems, getAllItemsByUser } from "@/lib/queries/items";
import ProductsGrid from "./ProductsGrid";

export default async function CatalogPage(props: {
  searchParams: Promise<{
    search?: string;
    sort?: string;
    priceRange?: string;
    category?: string;
    filter?: string;
    userId?: string;
  }>
}) {
  const {
    search = "",
    sort = "relevance",
    priceRange = "all",
    category = "",
    filter = "",
    userId = ""
  } = await props.searchParams;

  // Fetch items based on search + sort + priceRange
  let products: Product[] = [];

  if (userId) {
    products = await getAllItemsByUser(userId);
  }
  else if (search) {
    products = await searchItems(search, sort, priceRange);
  }
  else if (category && category !== "all") {
    products = await getAllItemsByCategory(category, sort, priceRange);
  }
  else if (filter) {
    products = await getFilteredItems(filter, sort);
  }
  else {
    products = await getAllItems(sort, priceRange);
  }

  return (
    <MainLayout showSidebar sidebar={<Sidebar />}>
      <div className={styles.catalogPage}>

        {/* Search + Filters Form */}
        <form action="/catalog" method="GET" className={styles.searchSection}>
          {/* Search Bar */}
          <input
            type="text"
            name="search"
            placeholder="Search for handcrafted items..."
            defaultValue={search}
            className={styles.searchInput}
          />

          {/* Filters */}
          <div className={styles.filters}>
            <h3 className={styles.filtersTitle}>Filters</h3>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Price Range</label>
              <select
                className={styles.filterSelect}
                name="priceRange"
                defaultValue={priceRange}
              >
                <option value="all">All Prices</option>
                <option value="under25">Under $25</option>
                <option value="25to50">$25 - $50</option>
                <option value="50to100">$50 - $100</option>
                <option value="over100">Over $100</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Sort By</label>
              <select
                name="sort"
                className={styles.filterSelect}
                defaultValue={sort}
              >
                <option value="relevance">Relevance</option>
                <option value="price_low_high">Price: Low to High</option>
                <option value="price_high_low">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className={styles.searchButton}>
            Apply Filters
          </button>
        </form>

        {/* Products */}
        <div className={styles.productsSection}>
          <h2 className={styles.sectionTitle}>All Products</h2>

          {/* <div className={styles.productGrid}>
            {products.length === 0 && (
              <p>No items found. Try another search.</p>
            )}

            {products.map((item) => (
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
                </div>
              </div>
            ))}
          </div> */}
          <ProductsGrid products={products} />
        </div>
      </div>
    </MainLayout>
  );
}