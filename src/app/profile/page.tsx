'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useSession, signOut } from 'next-auth/react';
import styles from './profile.module.css';
import catalogStyles from '../catalog/catalog.module.css';
import Link from 'next/link';

type Item = {
  itemid: string;
  product_name: string;
  product_picture: string | null;
  product_price: number;
  average_rating: number | null;
  artisan_name: string | null;
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const user = session?.user as any;
  const userType = user?.type; // "seller" or "customer"

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [picture, setPicture] = useState<string | null>(null);

  const [newFile, setNewFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState<Item[]>([]);

  // --------------------------
  // LOAD USER DATA
  // --------------------------
  useEffect(() => {
    if (status === 'authenticated' && user?.id) {
      setUserId(user.id);

      fetch(`/api/users?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (!data) return;

          setName(data.name ?? '');
          setEmail(data.email ?? '');
          setPicture(data.profilepicture ?? null);
          setCreatedAt(String(data.createdat));
        });

      if (user.type === 'seller') {
        fetch(`/api/items?userId=${user.id}`)
          .then(res => res.json())
          .then(data => {
            setProducts(data);
          });
      }

    }
  }, [status, session]);

  // --------------------------
  // FORMAT DATE
  // --------------------------
  const formattedDate =
    createdAt
      ? new Date(createdAt).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long'
      })
      : '';

  // --------------------------
  // PROFILE PICTURE HANDLING
  // --------------------------
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
    setTimeout(() => { URL.revokeObjectURL(url); }, 1000);
  };

  const uploadImage = async () => {
    if (!newFile) return null;

    const formData = new FormData();
    formData.append('file', newFile);

    const res = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.url; // returned image URL
  };

  // --------------------------
  // SAVE PROFILE
  // --------------------------
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    setMessage(null);

    let uploadedImage = picture;

    // upload new image if selected
    if (newFile) {
      const imgUrl = await uploadImage();
      if (imgUrl) uploadedImage = imgUrl;
    }

    const res = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        name,
        email,
        profilePicture: uploadedImage,
        type: userType
      })
    });

    if (res.ok) {
      setMessage('Profile updated successfully!');
      setPicture(uploadedImage);
      setPreview(null);
      setNewFile(null);
      setIsEditing(false);
    } else {
      setMessage('Failed to update profile.');
    }

    setLoading(false);
  };

  // --------------------------
  // CANCEL EDITING
  // --------------------------
  const handleCancel = () => {
    setIsEditing(false);
    setPreview(null);
    setNewFile(null);
  };

  // --------------------------
  // LOADING / AUTH CHECKS
  // --------------------------
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2>You must be logged in to view your profile.</h2>
        <a href="/login" style={{ color: '#C26D3D', fontWeight: 600 }}>Go to Login</a>
      </div>
    );
  }

  // --------------------------
  // COMMON UI ELEMENTS
  // --------------------------
  const avatarIcon = userType === 'seller' ? '🧑‍🎨' : '👤';
  const accountLabel = userType === 'seller' ? 'Artisan/Seller Account' : 'Customer Account';

  return (
    <div className={styles.profilePage}>
      {/* HEADER */}
      <div className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {preview ? (
              <img src={preview} alt="preview" className={styles.avatarImg} />
            ) : picture ? (
              <img src={picture} alt="profile" className={styles.avatarImg} />
            ) : (
              <span className={styles.placeholder}>{avatarIcon}</span>
            )}
          </div>

          {isEditing && (
            <label className={styles.btnEdit}>
              Change Photo
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>

        <div className={styles.profileInfo}>
          <h1 className={styles.profileName}>{name}</h1>

          <p className={styles.profileType}>{accountLabel}</p>

          <p className={styles.memberSince}>Member since {formattedDate}</p>

          {!isEditing && (
            <button className={styles.btnEdit} onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          )}
          <button
            className={styles.btnSignOut}
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className={styles.profileContent}>
        {/* ---------------- ACCOUNT INFO ---------------- */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Account Information</h2>

          <form className={styles.form} onSubmit={handleSave}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {isEditing && (
              <div className={styles.formActions}>
                <button type="button" className={styles.btnCancel} onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Save Changes
                </button>
              </div>
            )}
          </form>

          {message && (
            <div style={{ marginTop: '1rem', color: message.includes('success') ? 'green' : 'red' }}>
              {message}
            </div>
          )}
        </div>

        {/* ---------------- SELLER SECTIONS ---------------- */}
        {userType === 'seller' && (
          <>
            <div className={styles.section}>
              <div className={styles.sectionProducts}>
                <h2 className={styles.sectionTitle}>My Products</h2>
                <a href="/products/new" className={styles.btnPrimary} style={{ marginLeft: '1rem' }}>
                  ➕ Add Product
                </a>
              </div>
              <div className={catalogStyles.productGrid}>
                {products.length === 0 && (
                  <p>Your listed products will appear here</p>
                )}

                {products.map((item) => (
                  <div key={item.itemid} className={catalogStyles.productCard}>
                    <div className={catalogStyles.productImage}>
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
                        <span className={catalogStyles.placeholder}>📦</span>
                      )}
                    </div>

                    <div className={catalogStyles.productInfo}>
                      <h3 className={catalogStyles.productName}>{item.product_name}</h3>
                      <p className={catalogStyles.productArtisan}>
                        By {item.artisan_name || "Unknown"}
                      </p>

                      <div className={catalogStyles.productFooter}>
                        <span className={catalogStyles.productPrice}>
                          ${(item.product_price / 100).toFixed(2)}
                        </span>

                        <span className={catalogStyles.productRating}>
                          ⭐ {Number(item.average_rating || 0).toFixed(1)}
                        </span>
                      </div>
                      <Link href={`/products/edit?id=${item.itemid}`} className={catalogStyles.editButton}>
                        ✏️ Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ---------------- CUSTOMER SECTIONS ---------------- */}
        {userType === 'customer' && (
          <>
            {/* <div className={styles.section}>
              <h2 className={styles.sectionTitle}>My Orders</h2>
              <div className={styles.placeholder}>
                <p>Your order history will appear here</p>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Favorites</h2>
              <div className={styles.placeholder}>
                <p>Your favorite products will appear here</p>
              </div>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
}
