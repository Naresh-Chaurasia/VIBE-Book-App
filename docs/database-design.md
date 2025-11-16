# Database Design Document for VIBE Book App

## 1. Overview

This document outlines the database design for storing and managing JSON file details from the VIBE Book App's data folder. The system will support a Spring Boot REST API backend with a React frontend for accessing inspirational quotes, affirmations, and personal reflections.

## 2. Data Analysis

### 2.1 Current JSON Structure Analysis

Based on the existing JSON files in `/src/data/`, we have identified the following data types:

- **courage-disliked.json**: Quotes from "The Courage to be Disliked" book
- **emojis.json**: Status-based life journey entries with emoji indicators
- **emotional-intelligence.json**: Personal achievements and reflections
- **me.json**: Personal accomplishments and health improvements

### 2.2 Common Data Pattern

All JSON files follow a consistent structure with these core fields:
- `id`: Unique identifier
- `text`: Main content/quote text
- `author`: Author name
- `book`: Source book name
- `visible`: Boolean flag for visibility
- `comments`: Array of user comments with timestamps
- `affirmations`: Array of positive affirmations with timestamps
- `applications`: Array of practical applications with timestamps

## 3. Database Design

### 3.1 Entity-Relationship Diagram

```
[DataSource] 1--* [Quote] 1--* [Comment]
                                   |
                                   +--* [Affirmation]
                                   |
                                   +--* [Application]
```

### 3.2 Table Definitions

#### 3.2.1 data_sources Table
Stores metadata about each JSON file source

```sql
CREATE TABLE data_sources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    file_path VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

#### 3.2.2 quotes Table
Main table for storing quotes and reflections

```sql
CREATE TABLE quotes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    data_source_id BIGINT NOT NULL,
    external_id BIGINT NOT NULL, -- Original ID from JSON file
    text TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    book VARCHAR(255),
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (data_source_id) REFERENCES data_sources(id),
    UNIQUE KEY uk_source_external_id (data_source_id, external_id),
    INDEX idx_author (author),
    INDEX idx_book (book),
    INDEX idx_visible (visible)
);
```

#### 3.2.3 comments Table
User comments on quotes

```sql
CREATE TABLE comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    quote_id BIGINT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    INDEX idx_quote_id (quote_id),
    INDEX idx_created_at (created_at)
);
```

#### 3.2.4 affirmations Table
Positive affirmations related to quotes

```sql
CREATE TABLE affirmations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    quote_id BIGINT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    INDEX idx_quote_id (quote_id),
    INDEX idx_created_at (created_at)
);
```

#### 3.2.5 applications Table
Practical applications of quote insights

```sql
CREATE TABLE applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    quote_id BIGINT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    INDEX idx_quote_id (quote_id),
    INDEX idx_created_at (created_at)
);
```

### 3.3 Initial Data Setup

#### 3.3.1 Data Sources Seed Data

```sql
INSERT INTO data_sources (name, display_name, description, file_path, category) VALUES
('courage-disliked', 'The Courage to be Disliked', 'Quotes and insights from "The Courage to be Disliked" by Ichiro Kishimi and Fumitake Koga', '/src/data/courage-disliked.json', 'psychology'),
('emojis', 'Life Journey Emojis', 'Status-based life journey entries with emoji indicators', '/src/data/emojis.json', 'personal'),
('emotional-intelligence', 'Emotional Intelligence', 'Personal achievements and emotional intelligence reflections', '/src/data/emotional-intelligence.json', 'personal'),
('me', 'Personal Journey', 'Personal accomplishments and life improvements', '/src/data/me.json', 'personal');
```

## 4. Spring Boot REST API Design

### 4.1 API Architecture

#### 4.1.1 Layer Structure
- **Controller Layer**: REST endpoints
- **Service Layer**: Business logic
- **Repository Layer**: Data access using Spring Data JPA
- **Entity Layer**: JPA entities mapped to database tables

#### 4.1.2 Technology Stack
- Spring Boot 3.x
- Spring Data JPA with Hibernate
- MySQL/PostgreSQL database
- Spring Security for authentication
- Maven for dependency management
- Lombok for reducing boilerplate code

### 4.2 API Endpoints

#### 4.2.1 Data Source Management

```
GET    /api/v1/datasources              # List all data sources
GET    /api/v1/datasources/{id}         # Get specific data source
POST   /api/v1/datasources              # Create new data source
PUT    /api/v1/datasources/{id}         # Update data source
DELETE /api/v1/datasources/{id}         # Delete data source
```

#### 4.2.2 Quote Management

```
GET    /api/v1/quotes                   # Get all quotes with pagination
GET    /api/v1/quotes/{id}              # Get specific quote
POST   /api/v1/quotes                   # Create new quote
PUT    /api/v1/quotes/{id}              # Update quote
DELETE /api/v1/quotes/{id}              # Delete quote
GET    /api/v1/quotes/search            # Search quotes by text/author/book
GET    /api/v1/datasources/{id}/quotes  # Get quotes by data source
```

#### 4.2.3 Comment Management

```
GET    /api/v1/quotes/{quoteId}/comments        # Get comments for a quote
POST   /api/v1/quotes/{quoteId}/comments        # Add comment to quote
PUT    /api/v1/comments/{id}                   # Update comment
DELETE /api/v1/comments/{id}                   # Delete comment
```

#### 4.2.4 Affirmation Management

```
GET    /api/v1/quotes/{quoteId}/affirmations    # Get affirmations for a quote
POST   /api/v1/quotes/{quoteId}/affirmations    # Add affirmation to quote
PUT    /api/v1/affirmations/{id}               # Update affirmation
DELETE /api/v1/affirmations/{id}               # Delete affirmation
```

#### 4.2.5 Application Management

```
GET    /api/v1/quotes/{quoteId}/applications    # Get applications for a quote
POST   /api/v1/quotes/{quoteId}/applications    # Add application to quote
PUT    /api/v1/applications/{id}               # Update application
DELETE /api/v1/applications/{id}               # Delete application
```

### 4.3 Request/Response DTOs

#### 4.3.1 Quote DTO

```java
public class QuoteDTO {
    private Long id;
    private Long dataSourceId;
    private String dataSourceName;
    private String text;
    private String author;
    private String book;
    private Boolean visible;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CommentDTO> comments;
    private List<AffirmationDTO> affirmations;
    private List<ApplicationDTO> applications;
}
```

#### 4.3.2 Comment DTO

```java
public class CommentDTO {
    private Long id;
    private Long quoteId;
    private String text;
    private LocalDateTime createdAt;
}
```

#### 4.3.3 Search Request

```java
public class QuoteSearchRequest {
    private String query;
    private String author;
    private String book;
    private Long dataSourceId;
    private Boolean visible;
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private int page = 0;
    private int size = 20;
    private String sortBy = "createdAt";
    private String sortDirection = "DESC";
}
```

### 4.4 Service Layer Design

#### 4.4.1 QuoteService Interface

```java
@Service
public interface QuoteService {
    Page<QuoteDTO> getAllQuotes(Pageable pageable);
    QuoteDTO getQuoteById(Long id);
    QuoteDTO createQuote(CreateQuoteRequest request);
    QuoteDTO updateQuote(Long id, UpdateQuoteRequest request);
    void deleteQuote(Long id);
    Page<QuoteDTO> searchQuotes(QuoteSearchRequest searchRequest);
    Page<QuoteDTO> getQuotesByDataSource(Long dataSourceId, Pageable pageable);
}
```

#### 4.4.2 Data Import Service

```java
@Service
public class DataImportService {
    public void importFromJsonFile(String dataSourceName, MultipartFile file);
    public void importAllJsonFiles();
    public void exportToJsonFile(Long dataSourceId);
}
```

## 5. Frontend Integration

### 5.1 React Component Structure

```
src/
├── components/
│   ├── QuoteList.js          # Main quote listing component
│   ├── QuoteCard.js          # Individual quote display
│   ├── QuoteDetail.js        # Detailed quote view
│   ├── CommentSection.js    # Comments management
│   ├── AffirmationList.js    # Affirmations display
│   ├── ApplicationList.js    # Applications display
│   └── SearchFilters.js      # Search and filter controls
├── services/
│   └── api.js                # API client using axios/fetch
├── hooks/
│   ├── useQuotes.js          # Custom hook for quote operations
│   └── useSearch.js          # Custom hook for search functionality
└── utils/
    └── constants.js           # API endpoints and constants
```

### 5.2 API Client Design

```javascript
// services/api.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

export const quoteAPI = {
  getAllQuotes: (page = 0, size = 20) => 
    fetch(`${API_BASE_URL}/quotes?page=${page}&size=${size}`),
  
  getQuoteById: (id) => 
    fetch(`${API_BASE_URL}/quotes/${id}`),
  
  searchQuotes: (searchParams) => 
    fetch(`${API_BASE_URL}/quotes/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchParams)
    }),
  
  getQuotesByDataSource: (dataSourceId, page = 0, size = 20) => 
    fetch(`${API_BASE_URL}/datasources/${dataSourceId}/quotes?page=${page}&size=${size}`),
  
  addComment: (quoteId, comment) => 
    fetch(`${API_BASE_URL}/quotes/${quoteId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment)
    }),
  
  addAffirmation: (quoteId, affirmation) => 
    fetch(`${API_BASE_URL}/quotes/${quoteId}/affirmations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(affirmation)
    }),
  
  addApplication: (quoteId, application) => 
    fetch(`${API_BASE_URL}/quotes/${quoteId}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(application)
    })
};
```

## 6. Database Performance Considerations

### 6.1 Indexing Strategy
- Primary keys on all tables
- Foreign key indexes for join performance
- Composite indexes on frequently queried combinations
- Full-text search index on quote text for efficient searching

### 6.2 Caching Strategy
- Spring Cache with Redis for frequently accessed quotes
- Browser caching for static frontend assets
- Database query result caching for complex searches

### 6.3 Pagination
- Implement server-side pagination for large datasets
- Default page size of 20 quotes with configurable limits
- Cursor-based pagination for infinite scroll scenarios

## 7. Security Considerations

### 7.1 Authentication & Authorization
- JWT-based authentication for API access
- Role-based access control (Admin, User)
- CORS configuration for frontend integration

### 7.2 Data Validation
- Input validation on all API endpoints
- SQL injection prevention through parameterized queries
- XSS protection in frontend components

### 7.3 Data Privacy
- Sensitive data encryption
- Audit logging for data modifications
- GDPR compliance considerations

## 8. Deployment Architecture

### 8.1 Development Environment
- Spring Boot application on port 8080
- React development server on port 3000
- Local MySQL/PostgreSQL database
- Docker Compose for containerized setup

### 8.2 Production Environment
- Spring Boot application deployed on cloud platform (AWS/Azure/GCP)
- React build served by CDN or web server
- Managed database service (RDS/Cloud SQL)
- Load balancer and auto-scaling configuration

## 9. Migration Strategy

### 9.1 Data Migration Process
1. Create database schema using Flyway/Liquibase
2. Parse existing JSON files
3. Insert data into corresponding tables
4. Validate data integrity
5. Update frontend to use REST APIs

### 9.2 Rollback Plan
- Database schema versioning
- Data backup before migration
- Gradual rollout with feature flags
- Monitoring and alerting setup

## 10. Future Enhancements

### 10.1 Advanced Features
- Full-text search with Elasticsearch
- Machine learning for quote recommendations
- User favorites and bookmarking
- Social sharing capabilities
- Mobile app development

### 10.2 Analytics and Reporting
- Quote engagement metrics
- User activity tracking
- Popular quotes and authors
- Content performance analytics

## 11. Conclusion

This database design provides a robust foundation for the VIBE Book App, enabling efficient storage and retrieval of inspirational quotes and personal reflections. The modular architecture supports scalability, maintainability, and future feature enhancements while maintaining data integrity and performance.

The Spring Boot REST API design ensures clean separation of concerns and provides a comprehensive interface for the React frontend to interact with the database effectively.
