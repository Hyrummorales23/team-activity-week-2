'use client';


import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './edit-product.module.css';


export default function EditProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [productName, setProductName] = useState('Sample Product Name');
  const [category, setCategory] = useState('ceramics');
  const [description, setDescription] = useState('This is a beautiful handcrafted item made with care...');
  const [price, setPrice] = useState('45.99');
  const [stock, setStock] = useState('10');
  const [statusValue, setStatusValue] = useState('active');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const itemId = searchParams.get('id');

  useEffect(() => {
    if (!itemId) return;
    setLoading(true);
    setMessage(null);
    fetch(`/api/items?id=${itemId}`)
      .then(res => res.json())
      .then(data => {
        // If API returns a single item, not an array
        const product = Array.isArray(data) ? data[0] : data;
        if (product && product.itemId) {
          setProductName(product.productName || '');
          setCategory(product.category || '');
          setDescription(product.productDescription || '');
          setPrice(product.productPrice ? String(product.productPrice) : '');
          setStock(product.stock ? String(product.stock) : '');
          setStatusValue(product.status || 'active');
          setOwnerId(product.userId || product.user_id || null);
        } else {
          setMessage('Product not found.');
        }
      })
      .catch(() => setMessage('Error loading product.'))
      .finally(() => setLoading(false));
  }, [itemId]);

  // If not authenticated, show login prompt
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2>You must be logged in to edit products.</h2>
        <a href="/login" style={{ color: '#C26D3D', fontWeight: 600 }}>Go to Login</a>
      </div>
    );
  }

  // If authenticated but not owner, show error
  const userId = session && session.user ? (session.user as any).id : undefined;
  if (ownerId && userId && ownerId !== userId) {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2>You do not have permission to edit this product.</h2>
        <a href="/catalog" style={{ color: '#C26D3D', fontWeight: 600 }}>Back to Catalog</a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    if (!itemId) {
      setMessage('No product ID provided.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          productName,
          productDescription: description,
          productPrice: parseFloat(price),
          productPicture: '', // Add image upload logic if needed
          category,
          status: statusValue,
          stock: parseInt(stock, 10)
        })
      });
      if (res.ok) {
        setMessage('Product updated successfully!');
      } else {
        setMessage('Failed to update product.');
      }
    } catch (err) {
      setMessage('Error updating product.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!itemId) {
      setMessage('No product ID provided.');
      return;
    }
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/items', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      });
      if (res.ok) {
        setMessage('Product deleted successfully!');
        setTimeout(() => router.push('/profile'), 1200);
      } else {
        setMessage('Failed to delete product.');
      }
    } catch (err) {
      setMessage('Error deleting product.');
    } finally {
      setLoading(false);
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
                  checked={statusValue === 'active'}
                  onChange={(e) => setStatusValue(e.target.value)}
                />
                <span>Active (Visible to customers)</span>
              </label>
              <label className={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="status" 
                  value="draft"
                  checked={statusValue === 'draft'}
                  onChange={(e) => setStatusValue(e.target.value)}
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
              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
        {message && <div style={{ margin: '1rem 0', color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
      </div>
    </div>
  );
}
