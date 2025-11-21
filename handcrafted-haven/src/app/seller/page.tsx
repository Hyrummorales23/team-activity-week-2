'use client';

import { useState } from 'react';

export default function SellerDashboard() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    picture: '',
    category: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = ['Ceramics', 'Textiles', 'Woodwork', 'Jewelry', 'Painting', 'Sculpture', 'Leatherwork', 'Home Decor', 'Accessories', 'Other'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.picture.trim()) newErrors.picture = 'Picture URL is required';
    if (!formData.category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          description: '',
          price: '',
          picture: '',
          category: '',
        });
        setErrors({});
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.error || 'Failed to create item' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'var(--font-roboto), sans-serif', backgroundColor: 'var(--light-gray)', minHeight: '100vh' }}>
      <h1 style={{ color: 'var(--dark-gray)', marginBottom: '20px', fontFamily: 'var(--font-inter), sans-serif', fontWeight: '700' }}>Add New Item</h1>

      {success && (
        <div style={{ backgroundColor: 'var(--earth-green)', color: 'var(--white)', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
          Item created successfully!
        </div>
      )}

      {errors.submit && (
        <div style={{ backgroundColor: 'var(--warm-terracotta)', color: 'var(--white)', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--white)', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', color: 'var(--dark-gray)', fontWeight: '500' }}>Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: `1px solid var(--divider-gray)`, borderRadius: '5px', fontSize: '16px', fontFamily: 'inherit' }}
          />
          {errors.name && <span style={{ color: 'var(--warm-terracotta)', fontSize: '14px' }}>{errors.name}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', color: 'var(--dark-gray)', fontWeight: '500' }}>Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            style={{ width: '100%', padding: '8px', border: `1px solid var(--divider-gray)`, borderRadius: '5px', fontSize: '16px', fontFamily: 'inherit' }}
          />
          {errors.description && <span style={{ color: 'var(--warm-terracotta)', fontSize: '14px' }}>{errors.description}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="price" style={{ display: 'block', marginBottom: '5px', color: 'var(--dark-gray)', fontWeight: '500' }}>Price *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            style={{ width: '100%', padding: '8px', border: `1px solid var(--divider-gray)`, borderRadius: '5px', fontSize: '16px', fontFamily: 'inherit' }}
          />
          {errors.price && <span style={{ color: 'var(--warm-terracotta)', fontSize: '14px' }}>{errors.price}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="picture" style={{ display: 'block', marginBottom: '5px', color: 'var(--dark-gray)', fontWeight: '500' }}>Picture URL *</label>
          <input
            type="url"
            id="picture"
            name="picture"
            value={formData.picture}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: `1px solid var(--divider-gray)`, borderRadius: '5px', fontSize: '16px', fontFamily: 'inherit' }}
          />
          {errors.picture && <span style={{ color: 'var(--warm-terracotta)', fontSize: '14px' }}>{errors.picture}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="category" style={{ display: 'block', marginBottom: '5px', color: 'var(--dark-gray)', fontWeight: '500' }}>Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: `1px solid var(--divider-gray)`, borderRadius: '5px', fontSize: '16px', fontFamily: 'inherit' }}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <span style={{ color: 'var(--warm-terracotta)', fontSize: '14px' }}>{errors.category}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: 'var(--warm-terracotta)',
            color: 'var(--white)',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontFamily: 'inherit',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--earth-green)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--warm-terracotta)'; }}
        >
          {isSubmitting ? 'Creating...' : 'Add Item'}
        </button>
      </form>
    </div>
  );
}
