import './App.css';
import Typewriter from 'typewriter-effect';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function App() {
  const calculateYearsOfExperience = () => {
    const careerStartDate = new Date('2015-11-25');
    const currentDate = new Date();
    const yearsDiff = (currentDate - careerStartDate) / (1000 * 60 * 60 * 24 * 365.25);
    const decimalPart = yearsDiff - Math.floor(yearsDiff);

    return decimalPart > 0.75 ? Math.ceil(yearsDiff) : Math.floor(yearsDiff);
  };

  const yearsOfExperience = calculateYearsOfExperience();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const scrollToCalendly = () => {
    const calendlySection = document.querySelector('.calendly-section');
    if (calendlySection) {
      calendlySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    // Try multiple methods to ensure compatibility
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    // Fallback for older browsers
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  return (
    <div className="App">
      <div className="App-header">
        <img
          src="/pp.png"
          alt="Tushar Batra"
          className="profile-picture"
        />
        <div className="name-title">Tushar Batra</div>
        <div className="typewriter-container">
          <Typewriter
            changeDeleteSpeed={1000}
            options={{
              strings: ['More than a Web Developer', 'Located in India'],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
        <div className="summary-container">
          <p className="summary">
            Full stack developer with {yearsOfExperience} years of experience, proficient in a range of technologies including React, React Native, Ruby on Rails, Python, AWS, Google Cloud, Kafka.
          </p>
        </div>
        <div className="social-links">
          <a
            href="https://www.linkedin.com/in/tushar0837/"
            onClick={() => window.gtag('event', 'button_click', {
              'button_name': 'linkedin',
              'screen_name': 'Home'
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin"></i>
          </a>
          <a
            onClick={() => window.gtag('event', 'button_click', {
              'button_name': 'github',
              'screen_name': 'Home'
            })}
            href="https://www.github.com/tushar0837/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-button"
            aria-label="GitHub"
          >
            <i className="fab fa-github"></i>
          </a>
          <Link
            to="resume"
            target="_blank"
            className="social-button"
            aria-label="Resume"
            onClick={() => window.gtag('event', 'button_click', {
              'button_name': 'resume',
              'screen_name': 'Home'
            })}
          >
            <i className="fas fa-file-pdf"></i>
          </Link>
        </div>

        <button
          onClick={scrollToCalendly}
          className="book-meeting-btn"
        >
          <i className="fas fa-calendar-alt"></i>
          Book a Meeting
        </button>

        <div className="calendly-section">
          <div className="section-header">
            <h2 className="section-title">Book a Meeting</h2>
            <button
              onClick={scrollToTop}
              className="back-to-top-btn"
            >
              <i className="fas fa-arrow-up"></i>
              Back to Top
            </button>
          </div>
          <div className="calendly-container">
            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/tushar0837?background_color=15203c&text_color=00d9f0&primary_color=59ccff"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;