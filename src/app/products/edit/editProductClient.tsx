'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './edit-product.module.css';

export default function EditProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get('id');

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [ownerId, setOwnerId] = useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Prefill fields
  useEffect(() => {
    if (!itemId) return;
    setLoading(true);

    fetch(`/api/items?id=${itemId}`)
      .then(res => res.json())
      .then(data => {
        const product = Array.isArray(data) ? data[0] : data;
        if (!product || !product.itemid) return setMessage('Product not found.');

        setProductName(product.product_name || '');
        setCategory(product.category || '');
        setDescription(product.product_description || '');
        setPrice(product.product_price ? String((Number(product.product_price) / 100).toFixed(2)) : '');
        setStock(product.stock ? String(product.stock) : '');
        setOwnerId(product.user_id || null);

        if (product.product_picture) {
          setImagePreview(product.product_picture);
          setCurrentImageUrl(product.product_picture || "");
        }
      })
      .catch(() => setMessage('Error loading product.'))
      .finally(() => setLoading(false));
  }, [itemId]);

  // Auth gate
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated')
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2>You must be logged in to edit products.</h2>
        <a href="/login" style={{ color: '#C26D3D', fontWeight: 600 }}>Go to Login</a>
      </div>
    );

  const userId = session?.user ? (session.user as any).id : null;
  if (ownerId && userId && ownerId !== userId)
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2>You do not have permission to edit this product.</h2>
        <a href="/catalog" style={{ color: '#C26D3D', fontWeight: 600 }}>Back to Catalog</a>
      </div>
    );

  // Image validation
  const validateImage = (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setMessage('Only JPG, PNG, or GIF allowed.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image must be smaller than 5MB.');
      return false;
    }
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImage(file)) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!itemId) {
      setMessage("No product ID provided.");
      setLoading(false);
      return;
    }

    try {
      let productPicture = "";

      // Upload image if updated
      if (imageFile) {
        const data = new FormData();
        data.append("file", imageFile);

        const upload = await fetch("/api/upload-image", {
          method: "POST",
          body: data,
        });

        const result = await upload.json();
        if (!result.url) throw new Error("Failed to upload image");

        productPicture = result.url;
      } else {
        // keep the existing image
        productPicture = currentImageUrl || "";
      }

      const res = await fetch("/api/items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          productName,
          productDescription: description,
          productPrice: price === "" ? "" : Math.round(Number(price) * 100),
          productPicture,
          category,
          stock: stock || 0,
        }),
      });

      if (res.ok) {
        setMessage("Product updated successfully!");
        setTimeout(() => router.push("/profile"), 1000);
      } else {
        setMessage("Failed to update product.");
      }
    } catch (err: any) {
      setMessage(err?.message || "Error updating product.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!itemId) return setMessage('No product ID provided.');
    if (!confirm('Are you sure? This action cannot be undone.')) return;

    setLoading(true);
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
    } catch {
      setMessage('Error deleting product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.editPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit Product</h1>
        <Link href="/profile" className={styles.backLink}>← Back to Profile</Link>
      </div>

      <div className={styles.formCard}>
        <form className={styles.form} onSubmit={handleSubmit}>

          <div className={styles.imageSection}>
            <div
              className={styles.imagePreview}
              onDragOver={e => e.preventDefault()}
              style={{ border: "2px dashed #ccc", cursor: "pointer" }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: "100%", maxHeight: 120, objectFit: "contain" }} />
              ) : (
                <span className={styles.placeholder}>📦</span>
              )}
              <p className={styles.imageText}>Drag & drop or select an image</p>
            </div>

            <div className={styles.imageControls}>
              <label htmlFor="productImage" className={styles.btnSecondary}>Change Image</label>
              <input
                type="file"
                id="productImage"
                accept="image/*"
                className={styles.fileInput}
                onChange={handleImageChange}
              />
              <p className={styles.hint}>JPG, PNG, or GIF (Max 5MB)</p>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Product Name *</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g., Handcrafted Ceramic Bowl"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Category *</label>
            <select
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
            <label className={styles.label}>Description *</label>
            <textarea
              rows={5}
              className={styles.textarea}
              placeholder="Describe your product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={50}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Price *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className={styles.input}
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Stock</label>
              <input
                type="number"
                min="0"
                className={styles.input}
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.btnDelete} onClick={handleDelete}>
              Delete Product
            </button>

            <div className={styles.rightActions}>
              <Link href="/profile" className={styles.btnCancel}>Cancel</Link>
              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>

        {message && (
          <div style={{ margin: '1rem 0', color: message.includes('success') ? 'green' : 'red' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
