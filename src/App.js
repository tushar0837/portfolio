import './App.css';
import Typewriter from 'typewriter-effect';
import { Tooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Tooltip id="resume" />
      <Tooltip id="github" />
      <Tooltip id="linkedin" />
      <div className="App-header">
        <img
          src="/pp.png"
          alt="Profile Picture"
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
            Full stack developer with 9 years of experience, proficient in a range of technologies including React, React Native, Ruby on Rails, Python, AWS, Google Cloud, Kafka.
          </p>
        </div>
        <div className="social-links">
          <a
            data-tooltip-id="linkedin"
            data-tooltip-content="LinkedIn"
            href="https://www.linkedin.com/in/tushar0837/"
            onClick={() => window.gtag('event', 'button_click', {
              'button_name': 'linkedin',
              'screen_name': 'Home'
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button"
          >
            <i className="fab fa-linkedin"></i>
          </a>
          <a
            data-tooltip-id="github"
            data-tooltip-content="GitHub"
            onClick={() => window.gtag('event', 'button_click', {
              'button_name': 'github',
              'screen_name': 'Home'
            })}
            href="https://www.github.com/tushar0837/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-button"
          >
            <i className="fab fa-github"></i>
          </a>
          <Link
            to="resume"
            target="_blank"
            className="social-button"
            data-tooltip-id="resume"
            data-tooltip-content="Resume"
          >
            <i
              onClick={() => window.gtag('event', 'button_click', {
                'button_name': 'resume',
                'screen_name': 'Home'
              })}
              className="fas fa-file"
            ></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;