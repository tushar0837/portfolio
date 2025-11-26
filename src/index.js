import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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

// Send Core Web Vitals to Google Analytics for SEO monitoring
// Learn more: https://bit.ly/CRA-vitals
reportWebVitals((metric) => {
  // Send to Google Analytics 4
  if (window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }
});
