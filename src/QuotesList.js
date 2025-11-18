import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Import all JSON files statically
import hearTheBeat from './data/books/hear-the-beat-james-joseph.json';
import courageDisliked from './data/books/courage-disliked.json';

// Import from other directories
import musicalityTraining from './data/dance/musicality-training.json';
import me from './data/others/me.json';
import selfCare from './data/others/self-care.json';
import top3LifeGoals from './data/others/top-3-life-goals.json';
import emojis from './data/others/emojis.json';

// Map of book IDs to their corresponding data
const BOOK_DATA = {
  'books/hear-the-beat-james-joseph': hearTheBeat,
  'books/courage-disliked': courageDisliked,
  'dance/musicality-training': musicalityTraining,
  'others/me': me,
  'others/self-care': selfCare,
  'others/top-3-life-goals': top3LifeGoals,
  'others/emojis': emojis
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function QuotesList() {
  const { bookId } = useParams();
  const [quotes, setQuotes] = useState([]);
  const [bookTitle, setBookTitle] = useState('');
  const [activeQuoteKey, setActiveQuoteKey] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const loadBookData = () => {
      // Get the full path from the URL
      const fullPath = window.location.pathname;
      // Extract the part after /book/
      const pathAfterBook = fullPath.split('/book/')[1];
      
      console.log(`Loading data for path: ${pathAfterBook}`);
      
      try {
        // Try to find the book data with the exact path
        let bookData = BOOK_DATA[pathAfterBook];
        
        if (!bookData) {
          // If not found, try to find by the last part of the path
          const lastPart = pathAfterBook.split('/').pop();
          bookData = Object.entries(BOOK_DATA).find(([key]) => 
            key.endsWith(`/${lastPart}`)
          )?.[1];
        }
        
        if (!bookData) {
          throw new Error(`Book with ID ${pathAfterBook} not found.`);
        }
        
        console.log('Loaded book data for:', bookId, bookData);

        // Format the title from the filename
        const formattedTitle = bookId
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        // Handle the data based on its structure
        let quotesData = bookData.default || bookData;

        if (Array.isArray(quotesData)) {
          console.log('Data is an array, using directly');
          // Ensure each quote has comments, affirmations, and applications arrays
          const processedQuotes = quotesData.map((quote, index) => ({
            ...quote,
            key: `${quote.id}-${index}`,
            comments: Array.isArray(quote.comments) ? quote.comments : [],
            affirmations: Array.isArray(quote.affirmations) ? quote.affirmations : [],
            applications: Array.isArray(quote.applications) ? quote.applications : []
          }));
          setQuotes(processedQuotes);
          setBookTitle(formattedTitle);
          
          // Extract all unique categories
          const categories = new Set();
          processedQuotes.forEach(quote => {
            if (quote.category) {
              const cats = Array.isArray(quote.category) ? quote.category : [quote.category];
              cats.forEach(cat => categories.add(cat));
            }
          });
          setAllCategories(Array.from(categories).sort());
        } else if (quotesData && typeof quotesData === 'object') {
          console.log('Data is an object, checking for quotes array');
          // If it's an object with a 'quotes' array, use that
          if (Array.isArray(quotesData.quotes)) {
            console.log('Found quotes array in data');
            const processedQuotes = quotesData.quotes.map(quote => ({
              ...quote,
              comments: Array.isArray(quote.comments) ? quote.comments : [],
              affirmations: Array.isArray(quote.affirmations) ? quote.affirmations : [],
              applications: Array.isArray(quote.applications) ? quote.applications : []
            }));
            setQuotes(processedQuotes);
            setBookTitle(quotesData.title || formattedTitle);
          } else {
            // If it's a single quote object, wrap it in an array
            console.log('Wrapping single quote in array');
            const processedQuote = {
              ...quotesData,
              key: quotesData.id,
              comments: Array.isArray(quotesData.comments) ? quotesData.comments : [],
              affirmations: Array.isArray(quotesData.affirmations) ? quotesData.affirmations : [],
              applications: Array.isArray(quotesData.applications) ? quotesData.applications : []
            };
            setQuotes([processedQuote]);
            setBookTitle(quotesData.title || formattedTitle);
          }
        } else {
          console.error('Unexpected data format:', quotesData);
          throw new Error('Unexpected data format');
        }
      } catch (error) {
        console.error(`Error loading book with ID "${bookId}":`, error);
        setQuotes([]);
        setBookTitle(`Error loading: ${bookId}`);
      }
    };

    if (bookId) {
      console.log(`Book ID changed to: ${bookId}`);
      // Use setTimeout to ensure state updates don't happen during render
    const timer = setTimeout(() => {
      loadBookData();
    }, 0);
    
    return () => clearTimeout(timer);
    } else {
      console.error('No bookId provided');
    }
  }, [bookId]);

  // Filter quotes based on selected category
  const filteredQuotes = selectedCategory 
    ? quotes.filter(quote => {
        if (!quote.category) return false;
        const cats = Array.isArray(quote.category) ? quote.category : [quote.category];
        return cats.includes(selectedCategory);
      })
    : quotes;

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  if (!quotes.length) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <p>{bookTitle || 'Loading quotes...'}</p>
        <Link to="/" style={{ textDecoration: 'none', color: '#0066cc' }}>
          ← Back to Books
        </Link>
        <div style={{ marginTop: '20px' }}>
          <p>Debug info:</p>
          <pre>{JSON.stringify({
            bookId,
            quotesCount: quotes.length,
            bookTitle
          }, null, 2)}</pre>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#0066cc' }}>
          ← Back to Books
        </Link>
        <h1 style={{ margin: '10px 0' }}>{bookTitle}</h1>
        
        {/* Category Filter */}
        {allCategories.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#666' }}>
              Filter by Category:
            </h3>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px',
              marginBottom: '20px'
            }}>
              <div
                onClick={() => setSelectedCategory(null)}
                style={{
                  backgroundColor: selectedCategory === null ? '#28a745' : '#f8f9fa',
                  color: selectedCategory === null ? 'white' : '#333',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  border: '1px solid #ddd',
                  transition: 'all 0.2s ease'
                }}
              >
                All
              </div>
              {allCategories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => handleCategoryClick(category)}
                  style={{
                    backgroundColor: selectedCategory === category ? '#4a90e2' : '#f8f9fa',
                    color: selectedCategory === category ? 'white' : '#333',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    border: '1px solid #ddd',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {category}
                </div>
              ))}
            </div>
            {selectedCategory && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                marginTop: '10px'
              }}>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                  Filtered by: <strong>{selectedCategory}</strong>
                </span>
                <span 
                  onClick={() => setSelectedCategory(null)}
                  style={{
                    color: '#4a90e2',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '0.9rem'
                  }}
                >
                  Clear filter
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
        {filteredQuotes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <h3>No quotes found for category "{selectedCategory}"</h3>
            <p style={{ marginTop: '10px' }}>
              <span 
                onClick={() => setSelectedCategory(null)}
                style={{
                  color: '#4a90e2',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Clear filter to see all quotes
              </span>
            </p>
          </div>
        ) : (
          filteredQuotes.map((quote, index) => (
          <div key={`quote-wrapper-${index}`}>
            <div
              key={`${quote.id}-${index}`}
              style={{
                border: '1px solid #eee',
                borderRadius: '4px',
                padding: '15px',
                cursor: 'pointer',
                backgroundColor: activeQuoteKey === `${quote.id}-${index}` ? '#f9f9f9' : 'white',
                borderBottom: '1px solid #f0f0f0'
              }}
              onClick={(e) => {
                // Toggle the clicked quote using the unique key
                const quoteKey = `${quote.id}-${index}`;
                setActiveQuoteKey(activeQuoteKey === quoteKey ? null : quoteKey);
              }}
            >
            <div>
              <p style={{ margin: '0 0 10px 0' }}>{quote.text}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  {(quote.author || quote.book) && (
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      {quote.author && <span>{quote.author}</span>}
                      {quote.book && quote.author && <span> • </span>}
                      {quote.book && <span>{quote.book}</span>}
                      {quote.chapter && <span> • Chapter {quote.chapter}</span>}
                    </p>
                  )}
                </div>
                {quote.category && (
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '5px',
                    marginLeft: '10px',
                    flexShrink: 0,
                    justifyContent: 'flex-end'
                  }}>
                    {(Array.isArray(quote.category) ? quote.category : [quote.category]).map((cat, index) => (
                      <div 
                        key={index} 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent quote expansion
                          handleCategoryClick(cat);
                        }}
                        style={{
                          backgroundColor: selectedCategory === cat ? '#28a745' : '#4a90e2',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}>
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {activeQuoteKey === `${quote.id}-${index}` && (
              <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                {/* Comments Section */}
                {quote.comments && quote.comments.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>Comments</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
                      {quote.comments.map((comment, index) => (
                        <li
                          key={`comment-${index}`}
                          style={{
                            padding: '10px',
                            marginBottom: '8px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '4px',
                            fontSize: '1em'
                          }}
                        >
                          <p style={{ margin: '0 0 5px 0' }}>{comment.text}</p>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <span style={{ fontSize: '0.8rem', color: '#666' }}>
                              {formatDate(comment.date)}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Affirmations Section */}
                <div>
                  <h4 style={{ margin: '0 0 10px 0' }}>Affirmations</h4>
                  {quote.affirmations && quote.affirmations.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
                      {quote.affirmations.map((affirmation, index) => (
                        <li
                          key={`affirmation-${index}`}
                          style={{
                            padding: '10px',
                            marginBottom: '8px',
                            backgroundColor: '#f0f8ff',
                            borderRadius: '4px',
                            fontSize: '1em'
                          }}
                        >
                          <p style={{ margin: '0 0 5px 0', fontStyle: 'italic' }}>{affirmation.text}</p>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <span style={{ fontSize: '0.8rem', color: '#4a90e2' }}>
                              {formatDate(affirmation.date)}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#666', fontStyle: 'italic', fontSize: '0.9em', margin: '5px 0 15px' }}>
                      No affirmations available.
                    </p>
                  )}
                </div>

                {/* Applications Section */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>How I Used This In My Life</h4>
                  {quote.applications && quote.applications.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
                      {quote.applications.map((application, index) => (
                        <li
                          key={`application-${index}`}
                          style={{
                            padding: '10px',
                            marginBottom: '8px',
                            backgroundColor: '#e8f5e8',
                            borderRadius: '4px',
                            fontSize: '1em',
                            borderLeft: '4px solid #28a745'
                          }}
                        >
                          <p style={{ margin: '0 0 5px 0' }}>{application.text}</p>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <span style={{ fontSize: '0.8rem', color: '#28a745' }}>
                              {formatDate(application.date)}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#666', fontStyle: 'italic', fontSize: '0.9em', margin: '5px 0 15px' }}>
                      No applications recorded yet.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          {index < filteredQuotes.length - 1 && (
            <hr style={{ 
              border: 'none', 
              borderTop: '4px solid #4a90e2', 
              margin: '0',
              opacity: '0.6'
            }} />
          )}
          </div>
        )))}
      </div>
    </div>
  );
}

export default QuotesList;