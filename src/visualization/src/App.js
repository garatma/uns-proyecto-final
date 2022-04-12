import logo from "./logo.svg";
import "./App.css";

async function GetFromRoomEvent() {
  // just a sample get fetch to show how to pass a url for the backend
  fetch("/backend/room-event")
    .then((response) => response.text())
    .then((texto) => alert(texto))
    .catch((razon) => alert("no se pudo hacer el request: " + razon));
}

async function GetFromAnnouncement() {
  // just a sample get fetch to show how to pass a url for the backend
  var id = "";
  fetch("/backend/announcement/" + id)
    .then((response) => response.text())
    .then((texto) => alert(texto))
    .catch((razon) => alert("no se pudo hacer el request: " + razon));
}

async function Post() {
  const insert = {
    message: "A blog post by Kingsley",
    writer: "Brilliant post on fetch API",
    priority: "dsafa",
    timestamp_begin: 0,
    timestamp_end: 0,
    timestamp_create: 0,
    timestamp_update: 0,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(insert),
  };
  // just a sample get fetch to show how to pass a url for the backend
  fetch("/backend/announcement/", options)
    .then((response) => response.text())
    .then((texto) => alert(texto))
    .catch((razon) => alert("no se pudo hacer el request: " + razon));
}

async function Put() {
  const update = {
    id: 7,
    message: "sffdsada",
    writer: "Brilliant post on fetch API",
    priority: "dsafa",
    timestamp_begin: 0,
    timestamp_end: 0,
    timestamp_create: 0,
    timestamp_update: 0,
  };

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(update),
  };
  // just a sample get fetch to show how to pass a url for the backend
  fetch("/backend/announcement/", options)
    .then((response) => response.text())
    .then((texto) => alert(texto))
    .catch((razon) => alert("no se pudo hacer el request: " + razon));
}

async function Delete() {
  var id = "2";
  const options = {
    method: "DELETE",
  };
  // just a sample get fetch to show how to pass a url for the backend
  fetch("/backend/announcement/" + id, options)
    .then((response) => response.text())
    .then((texto) => alert(texto))
    .catch((razon) => alert("no se pudo hacer el request: " + razon));
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
          Learn React for visualization (testing)
        </a>
        <button onClick={GetFromRoomEvent}>Obtener info de room-event</button>
        <button onClick={GetFromAnnouncement}>
          Obtener info de announcement
        </button>
        <button onClick={Post}>Insertar en announcement</button>
        <button onClick={Put}>Actualizar en announcement</button>
        <button onClick={Delete}>Eliminar en announcement</button>
      </header>
    </div>
  );
}

export default App;
