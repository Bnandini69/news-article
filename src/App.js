import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import  { store } from './store';
import NewsArticle from './components/NewsArticle';

function App() {
  return (
    <Provider store={store}>
    <Router>
    <div>
      <Routes>
        <Route path="/" element={<NewsArticle />} />
      </Routes>
    </div>
  </Router>
  </Provider>
  );
}

export default App;
