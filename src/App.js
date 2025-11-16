import './App.css';
import Typewriter from 'typewriter-effect';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Chat from './components/Chat/Chat';
import { trackSocialClick, trackCalendlyScroll, trackScrollToTop, trackResumeView, trackScrollDepth, trackTimeOnPage, trackCalendlyEventScheduled } from './utils/analytics';

function App() {
  const calculateYearsOfExperience = () => {
    const careerStartDate = new Date('2015-11-25');
    const currentDate = new Date();
    const yearsDiff = (currentDate - careerStartDate) / (1000 * 60 * 60 * 24 * 365.25);
    const decimalPart = yearsDiff - Math.floor(yearsDiff);

    return decimalPart > 0.75 ? Math.ceil(yearsDiff) : Math.floor(yearsDiff);
  };

  const yearsOfExperience = calculateYearsOfExperience();
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  // Track time on page
  useEffect(() => {
    const startTime = Date.now();

    const trackTime = () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      trackTimeOnPage(timeSpent);
    };

    // Track time when user leaves the page
    window.addEventListener('beforeunload', trackTime);

    // Also track every 30 seconds for active sessions
    const interval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      if (timeSpent % 30 === 0) {
        trackTimeOnPage(timeSpent);
      }
    }, 30000);

    return () => {
      window.removeEventListener('beforeunload', trackTime);
      clearInterval(interval);
    };
  }, []);

  // Track scroll depth
  useEffect(() => {
    let maxScroll = 0;
    const trackScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercentage = Math.floor((scrollTop / (documentHeight - windowHeight)) * 100);

      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
        // Track milestones: 25%, 50%, 75%, 100%
        if (scrollPercentage >= 25 && scrollPercentage < 50 && maxScroll < 50) {
          trackScrollDepth(25);
        } else if (scrollPercentage >= 50 && scrollPercentage < 75 && maxScroll < 75) {
          trackScrollDepth(50);
        } else if (scrollPercentage >= 75 && scrollPercentage < 100 && maxScroll < 100) {
          trackScrollDepth(75);
        } else if (scrollPercentage === 100) {
          trackScrollDepth(100);
        }
      }
    };

    window.addEventListener('scroll', trackScroll);
    return () => window.removeEventListener('scroll', trackScroll);
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Listen for Calendly events
    const handleCalendlyEvent = (e) => {
      if (e.data.event === 'calendly.event_scheduled') {
        trackCalendlyEventScheduled();
      }
    };

    window.addEventListener('message', handleCalendlyEvent);

    return () => {
      document.body.removeChild(script);
      window.removeEventListener('message', handleCalendlyEvent);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const bookMeetingBtn = document.querySelector('.book-meeting-btn');
      if (bookMeetingBtn) {
        const rect = bookMeetingBtn.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        setShowScrollIndicator(!isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle URL hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#book-meeting') {
        setTimeout(() => {
          const section = document.getElementById('book-meeting');
          if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    };

    // Check hash on initial load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const scrollToCalendly = () => {
    trackCalendlyScroll();

    // Update URL hash without triggering page jump
    window.history.pushState(null, null, '#book-meeting');

    const calendlySection = document.getElementById('book-meeting');
    if (calendlySection) {
      calendlySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    trackScrollToTop();

    // Remove hash from URL
    window.history.pushState(null, null, window.location.pathname);

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
      <div className="bg-grid-mobile"></div>
      <div className="App-header">
        <div className="profile-section-mobile">
          <div className="morph-shape-mobile">
            <div className="shape-layer-mobile"></div>
            <div className="shape-layer-mobile"></div>
            <div className="shape-layer-mobile"></div>
          </div>
          <div className="initials-mobile">TB</div>
        </div>
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
            onClick={() => trackSocialClick('linkedin')}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin"></i>
          </a>
          <a
            onClick={() => trackSocialClick('github')}
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
            onClick={() => trackResumeView()}
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

        <div
          className={`scroll-down-indicator ${!showScrollIndicator ? 'hidden' : ''}`}
          onClick={scrollToCalendly}
        >
          <i className="fas fa-chevron-down"></i>
        </div>

        <div id="book-meeting" className="calendly-section">
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

      {/* AI Chat Component */}
      <Chat />
    </div>
  );
}

export default App;