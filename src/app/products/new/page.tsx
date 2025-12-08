"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../edit/edit-product.module.css";

export default function NewProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [statusValue, setStatusValue] = useState("active");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h2>You must be logged in to add a product.</h2>
        <a href="/login" style={{ color: "#C26D3D", fontWeight: 600 }}>Go to Login</a>
      </div>
    );
  }

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const userId = session && session.user ? (session.user as any).id : undefined;
    if (!userId) {
      setMessage("No user ID found. Please log in.");
      setLoading(false);
      return;
    }
    try {
      let productPicture = "";
      if (imageFile) {
        // Simulate upload, in real app upload to server or cloud storage
        productPicture = imagePreview;
      }
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          productDescription: description,
          productPrice: parseFloat(price),
          productPicture,
          category,
          userId,
          status: statusValue,
          stock: parseInt(stock, 10) || 0,
        }),
      });
      if (res.ok) {
        setMessage("Product created successfully!");
        setTimeout(() => router.push("/profile"), 1200);
      } else {
        setMessage("Failed to create product.");
      }
    } catch (err) {
      setMessage("Error creating product.");
    } finally {
      setLoading(false);
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
            <div
              className={styles.imagePreview}
              onDragOver={e => e.preventDefault()}
              onDrop={handleImageDrop}
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
              <label htmlFor="productImage" className={styles.btnSecondary}>
                Upload Image
              </label>
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
                  checked={statusValue === "active"}
                  onChange={(e) => setStatusValue(e.target.value)}
                />
                <span>Active (Visible to customers)</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={statusValue === "draft"}
                  onChange={(e) => setStatusValue(e.target.value)}
                />
                <span>Draft (Hidden from customers)</span>
              </label>
            </div>
          </div>

          <div className={styles.formActions}>
            <Link href="/profile" className={styles.btnCancel}>
              Cancel
            </Link>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? "Saving..." : "Add Product"}
            </button>
          </div>
        </form>
        {message && <div style={{ margin: "1rem 0", color: message.includes("success") ? "green" : "red" }}>{message}</div>}
      </div>
    </div>
  );
}
