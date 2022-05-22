import logo from "./logo.svg";
import "./App.css";
import React from "react";

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
        timestamp_update: 0
    };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(insert)
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
        timestamp_update: 0
    };

    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(update)
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
        method: "DELETE"
    };
    // just a sample get fetch to show how to pass a url for the backend
    fetch("/backend/announcement/" + id, options)
        .then((response) => response.text())
        .then((texto) => alert(texto))
        .catch((razon) => alert("no se pudo hacer el request: " + razon));
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
    }



    showHour = () => {
        return (
            < label >
                Desde:
                <input type="number" />
                <input type="number" />
                <select >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
                <input type="date"></input>
            </label >
        );
    }

    render() {
        let hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        let minutes = [];

        for (let i = 0; i < 60; i++) {
            minutes.push(i);
        }

        const listHours = hours.map((hour) => <option>{hour}</option>);
        const listMinutes = minutes.map((minute) => <option>{minute}</option>);

        return (
            <div div className="App" >
                <header className="App-header">

                    <form>
                        <label>Título:</label>
                        <input required type="text" placeholder="Escriba un título..." />
                        <br />
                        <label>Anuncio:</label>
                        <textarea required placeholder="Escriba un anuncio..." ></textarea>
                        <br />
                        {this.showHour()}
                        <label>
                            Hasta:
                            <select >
                                {listHours}
                            </select>
                            <select >
                                {listMinutes}
                            </select>
                            <select >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                            <input type="date"></input>
                        </label>
                        <br />
                        <label>Prioridad:</label>
                        <br />
                        <label>Autor/a:</label>
                        <button>Publicar Anuncio</button>
                    </form>
                </header>
            </div>
        );
    }
}

export default App;
