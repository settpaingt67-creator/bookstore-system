"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRouter as useNavRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewBookPage() {
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    price: '',
    description: '',
    cover_image: '',
    stock_quantity: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const navRouter = useNavRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get current user
      const savedUser = localStorage.getItem('user');
      if (!savedUser) {
        navRouter.push('/');
        return;
      }
      
      const user = JSON.parse(savedUser);

      const res = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock_quantity: parseInt(form.stock_quantity),
          created_by: user.id
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Book created successfully!');
        router.push('/books');
      } else {
        setError(data.error || 'Failed to create book');
      }
    } catch (err) {
      setError('An error occurred while creating the book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Samsung One UI Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link href="#" className="navbar-brand">Bookstore System (Admin)</Link>
          <div className="navbar-nav">
            <Link href="/books" className="nav-link">Back to Books</Link>
          </div>
        </div>
      </nav>

      <div className="container">
        <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <h1>Add New Book</h1>
          
          {error && (
            <div className="error">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Author *</label>
              <input
                type="text"
                name="author"
                className="form-input"
                value={form.author}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">ISBN</label>
              <input
                type="text"
                name="isbn"
                className="form-input"
                value={form.isbn}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price *</label>
              <input
                type="number"
                step="0.01"
                name="price"
                className="form-input"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Quantity *</label>
              <input
                type="number"
                name="stock_quantity"
                className="form-input"
                value={form.stock_quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cover Image URL</label>
              <input
                type="url"
                name="cover_image"
                className="form-input"
                value={form.cover_image}
                onChange={handleChange}
                placeholder="https://example.com/book-cover.jpg"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-textarea"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter book description..."
              />
            </div>

            <div className="form-group">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Book'}
              </button>
              <Link href="/books" className="btn btn-secondary" style={{ marginLeft: '1rem' }}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}