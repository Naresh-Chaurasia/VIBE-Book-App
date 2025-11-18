import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import QuotesList from "./QuotesList";
import BookList from "./BookList";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="app-nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/book/:bookId/*" element={<QuotesList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
