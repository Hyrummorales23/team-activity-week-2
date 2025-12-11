'use client';

import Link from 'next/link';
import styles from './home.module.css';
import { useEffect, useState } from 'react';

type SafeImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  type?: string;
};

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className, type }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    if (type === 'seller') return <div className={styles.imgPlaceholder}>👤</div>;
    return <div className={styles.imgPlaceholder}>🌟</div>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

export default function Home() {
  const categories = [
    { name: 'Ceramics', icon: '🏺', slug: 'ceramics' },
    { name: 'Textiles', icon: '🧵', slug: 'textiles' },
    { name: 'Woodwork', icon: '🪵', slug: 'woodwork' },
    { name: 'Jewelry', icon: '💍', slug: 'jewelry' },
  ];

  type Item = {
    product_picture: string | null;
    product_name: string;
    product_price: number | string;
  };

  type Seller = {
    name: string;
    profilepicture: string | null;
    average_rating: string;
  };

  const [topItems, setTopItems] = useState<Item[]>([]);
  const [loadingTopItems, setLoadingTopItems] = useState(true);
  const [errorTopItems, setErrorTopItems] = useState('');
  const [lastItems, setLastItems] = useState<Item[]>([]);
  const [loadingLastItems, setLoadingLastItems] = useState(true);
  const [errorLastItems, setErrorLastItems] = useState('');
  const [topSellers, setTopSellers] = useState<Seller[]>([]);
  const [loadingTopSellers, setLoadingTopSellers] = useState(true);
  const [errorTopSellers, setErrorTopSellers] = useState('');

  useEffect(() => {
    const load = async <T,>(
      url: string,
      setter: React.Dispatch<React.SetStateAction<T>>,
      errorSetter: React.Dispatch<React.SetStateAction<string>>,
      loadingSetter: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      try {
        const res = await fetch(url);
        const data = (await res.json()) as T;
        setter(data);
      } catch {
        errorSetter("Failed to load.");
      } finally {
        loadingSetter(false);
      }
    };

    load('/api/home/topItems', setTopItems, setErrorTopItems, setLoadingTopItems);
    load('/api/home/lastItems', setLastItems, setErrorLastItems, setLoadingLastItems);
    load('/api/home/topArtisans', setTopSellers, setErrorTopSellers, setLoadingTopSellers);
  }, []);

  return (
    <div className={styles.page}>

      {/* Floating Decorations */}
      <div className={styles.shape1}></div>
      <div className={styles.shape2}></div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.glassHero}>
          <h1 className={styles.heroTitle}>Unique. Local. Handcrafted.</h1>
          <p className={styles.heroSubtitle}>
            Explore a vibrant marketplace where creativity thrives
            and every piece tells a story.
          </p>
          <div className={styles.heroActions}>
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
              <span className={styles.categoryIcon}>{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.section}>
        <h2>Highest Rated Items</h2>
        <p className={styles.sectionSubtitle}>
          Explore the most acclaimed products on the website!
        </p>
        {loadingTopItems ? (
          <div>Loading...</div>
        ) : errorTopItems ? (
          <div>{errorTopItems}</div>
        ) : (
          <div className={styles.cardGrid}>
            {topItems.map((item, i) => (
              <div key={i} className={styles.itemCard}>
                <SafeImage
                  src={item.product_picture}
                  alt={item.product_name}
                  className={styles.itemImage}
                  type="item"
                />

                <h3>{item.product_name}</h3>
                <p className={styles.price}>{item.product_price ? (Number(item.product_price) / 100).toFixed(2) : "0.00"}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Latest Arrivals */}
      <section className={styles.section}>
        <h2>Latest Arrivals</h2>
        <p className={styles.sectionSubtitle}>
          Latest elements added to our catalog.
        </p>
        <div className={styles.arrivals}>
          {loadingLastItems ? (
            <div>Loading...</div>
          ) : errorLastItems ? (
            <div>{errorLastItems}</div>
          ) : (
            <div className={styles.cardGrid}>
              {lastItems.map((item, i) => (
                <div key={i} className={styles.itemCard}>
                  <SafeImage
                    src={item.product_picture}
                    alt={item.product_name}
                    className={styles.itemImage}
                    type="item"
                  />

                  <h3>{item.product_name}</h3>
                  <p className={styles.price}>{item.product_price ? (Number(item.product_price) / 100).toFixed(2) : "0.00"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top Sellers */}
      <section className={styles.section}>
        <h2>Top Sellers</h2>
        <p className={styles.sectionSubtitle}>
          Check out the most popular artisans on our platform.
        </p>
        {loadingTopSellers ? (
          <div>Loading...</div>
        ) : errorTopSellers ? (
          <div>{errorTopSellers}</div>
        ) : (
          <div className={styles.sellerGrid}>
            {topSellers.map((item, i) => (
              <div key={i} className={styles.sellerCard}>
                <SafeImage
                  src={item.profilepicture}
                  alt={item.name}
                  className={styles.itemImage}
                  type="seller"
                />

                <p>{item.name}</p>
                <p className={styles.price}>{item.average_rating ? (item.average_rating == "0" ? "0" : Number(item.average_rating).toFixed(2)) + '/5' : "0"}</p>
              </div>
            ))}
          </div>
        )}
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
