'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './edit-product.module.css';

export default function EditProductPage() {
  const [productName, setProductName] = useState('Sample Product Name');
  const [category, setCategory] = useState('ceramics');
  const [description, setDescription] = useState('This is a beautiful handcrafted item made with care...');
  const [price, setPrice] = useState('45.99');
  const [stock, setStock] = useState('10');
  const [status, setStatus] = useState('active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to API to update product
    alert('Product updated! (This will connect to your API endpoint)');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      // TODO: Connect to API to delete product
      alert('Product deleted! (This will connect to your API endpoint)');
    }
  };

  return (
    <div className={styles.editPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit Product</h1>
        <Link href="/profile" className={styles.backLink}>
          ← Back to Profile
        </Link>
      </div>

      <div className={styles.formCard}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.imageSection}>
            <div className={styles.imagePreview}>
              <span className={styles.placeholder}>📦</span>
              <p className={styles.imageText}>Current Product Image</p>
            </div>
            <div className={styles.imageControls}>
              <label htmlFor="productImage" className={styles.btnSecondary}>
                Change Image
              </label>
              <input 
                type="file" 
                id="productImage" 
                accept="image/*"
                className={styles.fileInput}
              />
              <p className={styles.hint}>JPG, PNG, or GIF (Max 5MB)</p>
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
              <option value="ceramics">Ceramics</option>
              <option value="textiles">Textiles</option>
              <option value="woodwork">Woodwork</option>
              <option value="jewelry">Jewelry</option>
              <option value="metalwork">Metalwork</option>
              <option value="glasswork">Glasswork</option>
              <option value="leather">Leather Goods</option>
              <option value="paper">Paper Crafts</option>
              <option value="pottery">Pottery</option>
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

            <div className={styles.formGroup}>
              <label htmlFor="stock" className={styles.label}>
                Stock Quantity
              </label>
              <input
                type="number"
                id="stock"
                placeholder="0"
                min="0"
                className={styles.input}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Product Status</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="status" 
                  value="active"
                  checked={status === 'active'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <span>Active (Visible to customers)</span>
              </label>
              <label className={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="status" 
                  value="draft"
                  checked={status === 'draft'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <span>Draft (Hidden from customers)</span>
              </label>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.btnDelete} onClick={handleDelete}>
              Delete Product
            </button>
            <div className={styles.rightActions}>
              <Link href="/profile" className={styles.btnCancel}>
                Cancel
              </Link>
              <button type="submit" className={styles.btnPrimary}>
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
