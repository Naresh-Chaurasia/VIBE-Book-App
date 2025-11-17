import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import all JSON files statically
import emotionalIntelligence from './data/books/emotional-intelligence.json';
import hearTheBeat from './data/books/hear-the-beat-james-joseph.json';
import courageDisliked from './data/books/courage-disliked.json';

// Import from data directory
import musicalityTraining from './data/dance/musicality-training.json';
import me from './data/others/me.json';
import selfCare from './data/others/self-care.json';
import top3LifeGoals from './data/others/top-3-life-goals.json';
import emojis from './data/others/emojis.json';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const loadBooks = () => {
      try {
        // Define the books with their static imports
        const booksData = [
          {
            id: 'books/emotional-intelligence',
            title: 'Emotional Intelligence',
            description: 'A collection of quotes about emotional intelligence',
            category: 'books',
            data: emotionalIntelligence
          },
          {
            id: 'books/hear-the-beat-james-joseph',
            title: 'Hear The Beat James Joseph',
            description: 'Musical insights from James Joseph',
            category: 'books',
            data: hearTheBeat
          },
          {
            id: 'books/courage-disliked',
            title: 'Courage Disliked',
            description: 'Thoughts on courage and facing dislikes',
            category: 'books',
            data: courageDisliked
          },
          {
            id: 'dance/musicality-training',
            title: 'Musicality Training',
            description: 'Training materials for musical development',
            category: 'dance',
            data: musicalityTraining
          },
          {
            id: 'others/me',
            title: 'About Me',
            description: 'Personal notes and reflections',
            category: 'others',
            data: me
          },
          {
            id: 'others/self-care',
            title: 'Self Care',
            description: 'Notes on self-care practices',
            category: 'others',
            data: selfCare
          },
          {
            id: 'others/top-3-life-goals',
            title: 'Top 3 Life Goals',
            description: 'My top life goals and aspirations',
            category: 'others',
            data: top3LifeGoals
          },
          {
            id: 'others/emojis',
            title: 'Emoji Collection',
            description: 'Collection of emojis and their meanings',
            category: 'others',
            data: emojis
          }
        ];

        setBooks(booksData);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(booksData.map(book => book.category))];
        setCategories(['all', ...uniqueCategories]);
      } catch (error) {
        console.error('Error loading books:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const filteredBooks = selectedCategory === 'all' 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>My Books</h1>
      
      {loading ? (
        <p>Loading books...</p>
      ) : (
        <>
          <div style={{ 
            marginBottom: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #eee'
          }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid #ddd',
                  background: selectedCategory === category ? '#007bff' : 'white',
                  color: selectedCategory === category ? 'white' : '#333',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.3s ease',
                }}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '20px' 
          }}>
            {filteredBooks.map((book) => {
              // Create a clean URL path without the 'books/' prefix
              const bookPath = book.id.startsWith('books/') ? book.id.substring(6) : book.id;
              return (
                <div key={book.id} style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  borderRadius: '4px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  ':hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                  }
                }}>
                  <Link 
                    to={`/book/${bookPath}`} 
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'block',
                      height: '100%'
                    }}
                  >
                    <h3 style={{ marginTop: 0, marginBottom: '10px' }}>{book.title}</h3>
                    <div style={{
                      display: 'inline-block',
                      background: '#f0f0f0',
                      padding: '3px 8px',
                      borderRadius: '10px',
                      fontSize: '0.8em',
                      color: '#666',
                      marginBottom: '10px'
                    }}>
                      {book.category}
                    </div>
                    <p style={{ color: '#666', margin: '10px 0 0' }}>{book.description}</p>
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default BookList;
