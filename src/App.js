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
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '20px'
          }}
        />
        <div style={{fontSize: 44, marginBottom: 20}}>Tushar Batra</div>
        <Typewriter
        changeDeleteSpeed={1000}
  options={{
    strings: ['More than a Web Developer', 'Located in India'],
    autoStart: true,
    loop: true,
  }}
/>
        <div>
         <p className="summary">Full stack developer with 8 years of experience, proficient in a range of technologies including React, React Native, Ruby on Rails, Python, AWS, Google Cloud, Kafka.</p>
        </div>
        <div>
        <a 
            data-tooltip-id="linkedin" data-tooltip-content="LinkedIn"
            href="https://www.linkedin.com/in/tushar0837/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '10px',
              backgroundColor: '#0077B5',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '100%',
              fontSize: '20px',
              height: 25,
              width: 25
            }}
          >
            <i className="fab fa-linkedin"></i>
          </a>
          <a
           data-tooltip-id="github" data-tooltip-content="GitHub"
            href="https://www.github.com/tushar0837/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '10px',
              backgroundColor: '#0077B5',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '100%',
              fontSize: '20px',
              height: 25,
              width: 25,
              marginLeft: 15
            }}
          >
            <i className="fab fa-github"></i>
          </a>
          
          <Link to="resume" target="_blank" style={{
              display: 'inline-block',
              padding: '10px',
              backgroundColor: '#0077B5',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '100%',
              fontSize: '20px',
              height: 25,
              width: 25,
              marginLeft: 15
            }}>
            <i className="fas fa-file"></i>
          </Link>
          </div>
      </div>
    </div>
  );
}

export default App;