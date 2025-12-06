'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from '../edit/edit-product.module.css';

export default function AddProductPage() {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [productPicture, setProductPicture] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const itemData = {
        productName,
        productDescription: description,
        productPrice: parseFloat(price),
        productPicture,
        category,
      };

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (response.ok) {
        alert('Product added successfully!');
        // Reset form
        setProductName('');
        setCategory('');
        setDescription('');
        setPrice('');
        setProductPicture('');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.editPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Add New Product</h1>
        <Link href="/profile" className={styles.backLink}>
          ← Back to Profile
        </Link>
      </div>

      <div className={styles.formCard}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.imageSection}>
            <div className={styles.imagePreview}>
              <span className={styles.placeholder}>📦</span>
              <p className={styles.imageText}>Product Image</p>
            </div>
            <div className={styles.imageControls}>
              <label htmlFor="productImage" className={styles.btnSecondary}>
                Upload Image
              </label>
              <input
                type="url"
                id="productImage"
                placeholder="https://example.com/image.jpg"
                className={styles.input}
                value={productPicture}
                onChange={(e) => setProductPicture(e.target.value)}
              />
              <p className={styles.hint}>Enter image URL (JPG, PNG, or GIF)</p>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="productName" className={styles.label}>
              Product Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="productName"
              placeholder="e.g., Handcrafted Ceramic Bowl"
              className={styles.input}
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>
              Category <span className={styles.required}>*</span>
            </label>
            <select
              id="category"
              className={styles.input}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="jewelry">Jewelry</option>
              <option value="art">Art</option>
              <option value="clothing">Clothing</option>
              <option value="home_decor">Home Decor</option>
              <option value="toys">Toys</option>
              <option value="books">Books</option>
              <option value="electronics">Electronics</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description <span className={styles.required}>*</span>
            </label>
            <textarea
              id="description"
              rows={5}
              placeholder="Describe your product, materials used, size, care instructions..."
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={50}
            />
            <p className={styles.hint}>Min 50 characters ({description.length}/50)</p>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>
                Price ($) <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="price"
                placeholder="0.00"
                step="0.01"
                min="0"
                className={styles.input}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <div className={styles.rightActions}>
              <Link href="/profile" className={styles.btnCancel}>
                Cancel
              </Link>
              <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
                {isSubmitting ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
