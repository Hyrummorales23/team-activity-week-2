"use client";

import React, { useState } from "react";
import styles from "./catalog.module.css";
import type { Product } from "@/lib/queries/items";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";

export default function ProductsGrid({ products }: { products: Product[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Product | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user as any;

  const open = (p: Product) => {
    setSelected(p);
    setRating(0);
  };
  const close = () => {
    setSelected(null);
    setRating(0);
    setSubmitting(false);
  };

  const submitRating = async () => {
    if (!selected || rating < 1) return;
    setSubmitting(true);
    if (status !== 'authenticated' || !user?.id) return;

    try {
      // placeholder API trigger - adapt server route later
      await fetch("/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: selected.itemid,
          rating_value: rating,
          user_id: user.id,
        }),
      });
      router.refresh();
    } catch (err) {
      console.error("rating error (placeholder):", err);
    } finally {
      setSubmitting(false);
      close();
    }
  };

  const formatPrice = (p: number | string) => {
    const n = typeof p === "string" ? Number(p) : p;
    if (isNaN(n)) return "$0.00";
    return `$${(n / 100).toFixed(2)}`;
  };

  return (
    <>
      <div className={styles.productGrid}>
        {products.length === 0 && <p>No items found. Try another search.</p>}

        {products.map((item) => (
          <div key={item.itemid} className={styles.productCard}>
            <div className={styles.productImage}>
              {item.product_picture ? (
                <img
                  src={item.product_picture}
                  alt={item.product_name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                  {formatPrice(item.product_price)}
                </span>

                <span className={styles.productRating}>
                  ⭐ {Number(item.average_rating || 0).toFixed(1)}
                </span>
              </div>

              <div className={styles.productActions}>
                <button
                  className={styles.detailsButton}
                  onClick={() => open(item)}
                >
                  Details & Rate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div className={styles.modalBackdrop} onClick={close}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button className={styles.modalClose} onClick={close}>
              ✕
            </button>

            <div className={styles.modalBody}>
              <div className={styles.modalImageWrap}>
                {selected.product_picture ? (
                  <img
                    src={selected.product_picture}
                    alt={selected.product_name}
                    className={styles.modalImage}
                  />
                ) : (
                  <div className={styles.modalPlaceholder}>📦</div>
                )}
              </div>

              <div className={styles.modalDetails}>
                <h2>{selected.product_name}</h2>
                <p className={styles.modalArtisan}>
                  By {selected.artisan_name || "Unknown"}
                </p>
                <p className={styles.modalPrice}>
                  {formatPrice(selected.product_price)}
                </p>
                <p className={styles.modalDescription}>
                  {selected.product_description || "No description available."}
                </p>

                <div className={styles.modalRating}>
                  <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`${styles.star} ${rating >= s ? styles.starOn : ""}`}
                        onClick={() => setRating(s)}
                        aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <button
                    className={styles.submitRating}
                    onClick={submitRating}
                    disabled={submitting || rating < 1}
                  >
                    {submitting ? "Sending..." : `Submit ${rating || ""}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
