import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

const Resume = () => {
  const navigate = useNavigate();

  useEffect(() => {
      const pdfUrl = `/Resume_TusharBatra.pdf`;

      // Redirect to the PDF file
      window.location.href = pdfUrl;

      // Optionally, navigate back if needed
      return () => navigate(-1);
  }, [navigate]);
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
