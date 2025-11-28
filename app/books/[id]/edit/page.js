"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    price: "",
    description: "",
    cover_image: "",
    stock_quantity: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is logged in and is admin
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/');
      return;
    }
    
    const user = JSON.parse(savedUser);
    if (user.role !== 'admin') {
      router.push('/books');
      return;
    }

    fetchBook();
  }, [id, router]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/books/${id}`);
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to fetch book');
      }
      
      const data = await res.json();
      setForm({
        title: data.title || "",
        author: data.author || "",
        isbn: data.isbn || "",
        price: data.price || "",
        description: data.description || "",
        cover_image: data.cover_image || "",
        stock_quantity: data.stock_quantity || ""
      });
    } catch (err) {
      setError(err.message || 'Error loading book');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock_quantity: parseInt(form.stock_quantity)
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Book updated successfully!');
        router.push('/books');
      } else {
        setError(data.error || data.message || "Failed to update book");
      }
    } catch (err) {
      setError("An error occurred while updating the book");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <nav className="navbar">
          <div className="navbar-container">
            <Link href="#" className="navbar-brand">Bookstore System (Admin)</Link>
            <Link href="/books" className="nav-link">Back to Books</Link>
          </div>
        </nav>
        <div className="container">
          <div className="loading">Loading book details...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Samsung One UI Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link href="#" className="navbar-brand">Bookstore System (Admin)</Link>
          <div className="navbar-nav">
            <Link href={`/books/${id}`} className="nav-link">View Details</Link>
            <Link href="/books" className="nav-link">Back to Books</Link>
          </div>
        </div>
      </nav>

      <div className="container">
        <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <h1>Edit Book</h1>
          
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
                rows="6"
                placeholder="Enter book description..."
              />
            </div>

            <div className="form-group">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Updating...' : 'Update Book'}
              </button>
              <Link href={`/books/${id}`} className="btn btn-secondary" style={{ marginLeft: '1rem' }}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}