import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const importAll = async () => {
      try {
        const context = require.context('./data', false, /\.json$/);
        
        const bookPromises = context.keys().map(async (fileName) => {
          const id = fileName.replace(/^.*[\\/]/, '').replace(/\.json$/, '');
          const data = await import(`./data/${id}.json`);
          
          return {
            id,
            title: formatTitle(id),
            description: `A collection of quotes from ${formatTitle(id)}`,
            data: data.default || data
          };
        });

        const loadedBooks = await Promise.all(bookPromises);
        setBooks(loadedBooks);
      } catch (error) {
        console.error('Error loading books:', error);
      } finally {
        setLoading(false);
      }
    };

    importAll();
  }, []);

  const formatTitle = (str) => {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>My Books</h1>
      
      {loading ? (
        <p>Loading books...</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px' 
        }}>
          {books.map((book) => (
            <Link 
              to={`/book/${book.id}`} 
              key={book.id} 
              style={{
                textDecoration: 'none',
                color: 'inherit',
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '4px',
              }}
            >
              <h3 style={{ marginTop: 0 }}>{book.title}</h3>
              <p style={{ color: '#666' }}>{book.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
