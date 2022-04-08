import logo from './logo.svg';
import './App.css';

async function Get() {
  fetch("http://localhost:3000")
    .then(response => response.text())
    .then(texto => alert(texto))
    .catch(razon => alert("no se pudo hacer el request: " + razon));
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React for visualization
        </a>
        <button onClick={Get}>Consultar backend</button>
      </header>
    </div>
  );
}

export default App;
