import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

const Resume = () => {
  return (
    <div style={{ height: '100vh' }}>
      <iframe
        src='/Tushar_Resume_Oct24.pdf'
        title='Resume'
        width='100%'
        height='100%'
        style={{ border: 'none' }}
      />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route exact path='/' element={<App />}></Route>
      <Route exact path='/resume' element={<Resume />} />
      <Route exact path='/*' element={<App />} />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
