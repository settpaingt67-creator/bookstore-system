"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/');
      return;
    }
    
    const userData = JSON.parse(savedUser);
    setUser(userData);
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
      setBook(data);
    } catch (err) {
      setError(err.message || 'Error loading book details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${book.title}"? This action cannot be undone.`)) return;
    
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert(`"${book.title}" has been deleted successfully!`);
        router.push('/books');
      } else {
        alert(data.error || data.message || 'Failed to delete book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book. Please try again.');
    }
  };

  if (!user) {
    return <div className="loading">Checking authentication...</div>;
  }

  if (loading) {
    return (
      <div>
        <nav className="navbar">
          <div className="navbar-container">
            <Link href="#" className="navbar-brand">Bookstore System</Link>
            <Link href="/books" className="nav-link">Back to Books</Link>
          </div>
        </nav>
        <div className="container">
          <div className="loading">Loading book details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <nav className="navbar">
          <div className="navbar-container">
            <Link href="#" className="navbar-brand">Bookstore System</Link>
            <Link href="/books" className="nav-link">Back to Books</Link>
          </div>
        </nav>
        <div className="container">
          <div className="error" style={{ margin: '2rem 0' }}>
            {error}
          </div>
          <Link href="/books" className="btn btn-primary">Back to Books</Link>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <div>
      {/* Samsung One UI Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link href="#" className="navbar-brand">
            Bookstore System {isAdmin ? '(Admin)' : '(User)'}
          </Link>
          <div className="navbar-nav">
            {isAdmin && (
              <Link href={`/books/${id}/edit`} className="nav-link">Edit Book</Link>
            )}
            <Link href="/books" className="nav-link">Back to Books</Link>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="book-detail-container">
          <div className="book-detail-card">
            <div className="book-detail-header">
              {/* Book Cover */}
              <div className="book-detail-cover">
                {book.cover_image ? (
                  <img 
                    src={book.cover_image} 
                    alt={book.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-large)'
                    }}
                  />
                ) : (
                  <span>No Cover Image</span>
                )}
              </div>

              {/* Book Details */}
              <div className="book-detail-info">
                <h1 className="book-detail-title">{book.title}</h1>
                
                <p className="book-detail-author">
                  by <strong>{book.author}</strong>
                </p>

                <div className="book-detail-meta">
                  <div className="meta-item">
                    <span className="meta-label">Price</span>
                    <span className="meta-value" style={{ color: 'var(--primary-blue)' }}>
                      ${book.price}
                    </span>
                  </div>
                  
                  <div className="meta-item">
                    <span className="meta-label">Stock Available</span>
                    <span className="meta-value" style={{ 
                      color: book.stock_quantity > 0 ? 'var(--success-green)' : 'var(--error-red)' 
                    }}>
                      {book.stock_quantity} units
                    </span>
                  </div>
                  
                  {book.isbn && (
                    <div className="meta-item">
                      <span className="meta-label">ISBN</span>
                      <span className="meta-value">
                        {book.isbn}
                      </span>
                    </div>
                  )}

                  {book.created_by_name && (
                    <div className="meta-item">
                      <span className="meta-label">Added By</span>
                      <span className="meta-value">
                        {book.created_by_name}
                      </span>
                    </div>
                  )}
                </div>

                {book.description && (
                  <div className="book-detail-description">
                    <h2 style={{ 
                      fontSize: '1.5rem', 
                      marginBottom: '1rem',
                      color: 'var(--text-primary)'
                    }}>
                      Description
                    </h2>
                    <p style={{ 
                      lineHeight: '1.6',
                      color: 'var(--text-secondary)',
                      fontSize: '1.1rem'
                    }}>
                      {book.description}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="book-detail-actions">
                  {isAdmin ? (
                    <>
                      <Link 
                        href={`/books/${id}/edit`}
                        className="btn btn-primary"
                      >
                        Edit Book
                      </Link>
                      <button 
                        onClick={handleDelete}
                        className="btn btn-danger"
                      >
                        Delete Book
                      </button>
                      <Link 
                        href="/books"
                        className="btn btn-secondary"
                      >
                        Back to Books
                      </Link>
                    </>
                  ) : (
                    <>
                      <button 
                        className="btn btn-primary"
                        onClick={() => alert('This would add to cart in a real application')}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="btn btn-accent"
                        onClick={() => alert('This would show more details in a real application')}
                      >
                        Wishlist
                      </button>
                      <Link 
                        href="/books"
                        className="btn btn-secondary"
                      >
                        Back to Books
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}