"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/');
      return;
    }
    
    const userData = JSON.parse(savedUser);
    setUser(userData);
    fetchBooks();
  }, [router]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/books');
      
      if (!res.ok) {
        throw new Error('Failed to fetch books');
      }
      
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleDelete = async (bookId, bookTitle) => {
    if (!confirm(`Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`)) return;
    
    try {
      console.log('Frontend: Deleting book with ID:', bookId, 'Title:', bookTitle);
      
      const res = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      console.log('Frontend: Delete response:', data);

      if (res.ok && data.success) {
        // Remove book from local state immediately for better UX
        setBooks(books.filter(book => book.id !== bookId));
        alert(`"${bookTitle}" has been deleted successfully!`);
        
        // Optional: Refresh the books list to ensure consistency
        // fetchBooks();
      } else {
        alert(data.error || data.message || 'Failed to delete book. Please try again.');
      }
    } catch (error) {
      console.error('Frontend: Error deleting book:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  if (!user) {
    return <div className="loading">Checking authentication...</div>;
  }

  const isAdmin = user.role === 'admin';

  return (
    <div>
      {/* Enhanced Samsung One UI 8 Style Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link href="#" className="navbar-brand">
            Bookstore System {isAdmin ? '(Admin)' : '(User)'}
          </Link>
          
          <div className="navbar-nav">
            <div className="user-info">
              <span>Welcome, {user.name} ({user.role})</span>
            </div>
            
            {isAdmin && (
              <Link href="/books/new" className="nav-link">
                Add New Book
              </Link>
            )}
            
            <button 
              onClick={handleLogout}
              className="nav-link"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.9)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '15px',
                fontWeight: '600'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <h1 style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          {isAdmin ? 'Book Management' : 'Available Books'}
        </h1>
        
        {error && (
          <div className="error">
            {error}
          </div>
        )}
        
        {isAdmin ? (
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            As an administrator, you can manage all books in the system.
          </p>
        ) : (
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Browse our collection of available books.
          </p>
        )}
        
        {loading ? (
          <div className="loading">Loading books...</div>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <div key={book.id} className="book-card">
                {book.cover_image && (
                  <img 
                    src={book.cover_image} 
                    alt={book.title}
                    className="book-image"
                  />
                )}
                {!book.cover_image && (
                  <div className="book-image">
                    Book Cover
                  </div>
                )}
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <p className="book-price">${book.price}</p>
                <p className="book-stock">
                  <strong>Stock:</strong> {book.stock_quantity} units
                </p>
                {book.description && (
                  <p style={{ 
                    color: 'var(--text-secondary)', 
                    fontSize: '0.9rem',
                    marginBottom: '1rem'
                  }}>
                    {book.description.substring(0, 100)}...
                  </p>
                )}
                
    {isAdmin ? (
  <div className="book-actions">
    <Link 
      href={`/books/${book.id}`}
      className="btn-compact btn-compact-primary"
    >
      View
    </Link>
    <Link 
      href={`/books/${book.id}/edit`}
      className="btn-compact btn-compact-secondary"
    >
      Edit
    </Link>
    <button 
      onClick={() => handleDelete(book.id, book.title)}
      className="btn-compact btn-compact-danger"
    >
      Delete
    </button>
  </div>
) : (
  <div className="book-actions">
    <button 
      className="btn-compact btn-compact-primary"
      onClick={() => alert('This would add to cart in a real application')}
    >
      Add to Cart
    </button>
    <Link 
      href={`/books/${book.id}`}
      className="btn-compact btn-compact-secondary"
    >
      Details
    </Link>
  </div>
)}
              </div>
            ))}
          </div>
        )}

        {books.length === 0 && !loading && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p>No books found.</p>
            {isAdmin && (
              <Link href="/books/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Add Your First Book
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}