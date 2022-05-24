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

class Date extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: 0
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.setState({ startDate: event.target.value });
        console.log(event.target.value);
    }

    render() {
        return <input className="date" type="date" value={this.state.startDate} onChange={this.handleInputChange} />;
    }
}

class Number extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            number: 0
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        let value = event.target.value;
        if (value < this.props.min || value > this.props.max) return;
        this.setState({
            number: parseInt(value)
        });
    }
    render() {
        return (
            <input
                className="hourAndMinutes"
                type="number"
                min={this.props.min}
                max={this.props.max}
                value={this.state.number}
                onChange={this.handleInputChange}
            />
        );
    }
}

class App extends React.Component {
    render() {
        let hours = ["00", "01", 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        let minutes = [];

        for (let i = 0; i < 60; i++) {
            minutes.push(i);
        }

        const listHours = hours.map((hour) => <option>{hour}</option>);
        const listMinutes = minutes.map((minute) => <option>{minute}</option>);

        return (
            <div div className="App">
                <header className="App-header">
                    <form>
                        <label>Título:</label>
                        <input required type="text" placeholder="Escriba un título..." />
                        <br />
                        <label>Anuncio:</label>
                        <textarea required placeholder="Escriba un anuncio..."></textarea>
                        <br />
                        <label>
                            Desde:
                            <Date />
                            <Number min={0} max={23} />
                            :
                            <Number min={0} max={59} />
                            hs
                        </label>
                        <label>
                            Hasta:
                            <Date />
                            <Number min={0} max={23} />
                            :
                            <Number min={0} max={59} />
                            hs
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
