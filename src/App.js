import './App.css';
import Typewriter from 'typewriter-effect';



function App() {
  return (
    <div className="App">
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
         <p>I’m a full stack developer with 8 years of experience.</p>
        </div>
        {/* <a 
          href="/resume.pdf" 
          download="Tushar_Batra_Resume.pdf"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#676767',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            marginTop: '20px'
          }}
        >
          Download Resume
        </a> */}
        <div>
        <a 
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
          </div>
      </div>
    </div>
  );
}

export default App;