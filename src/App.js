import React from 'react';
import NewsFeed from './components/NewsFeed';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import  { store } from './store';

function App() {
  return (
    <Provider store={store}>
    <Router>
    <div>
      <Routes>
        <Route path="/" element={<NewsFeed />} />
      </Routes>
    </div>
  </Router>
  </Provider>
  );
}

export default App;
