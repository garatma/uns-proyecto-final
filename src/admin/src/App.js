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

class Time extends React.Component {
    render() {
        return (
            <div>
                <Date />
                <Number min={0} max={23} />
                :
                <Number min={0} max={59} />
                hs
            </div>
        );
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


class Announcement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            textAnnouncement: "",
            author: ""
        };

        this.handleTextChange = this.handleTextChange.bind(this);
    }

    handleTextChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <div>
                <form>
                    <label>Título:</label>
                    <input required name="title" type="text" value={this.state.title} onChange={this.handleTextChange} />
                    <label>Anuncio:</label>
                    <textarea required name="textAnnouncement" value={this.state.textAnnouncement} onChange={this.handleTextChange} ></textarea>
                    <label>
                        Desde:
                        <Time />
                    </label>
                    <label>
                        Hasta:
                        <Time />
                    </label>
                    <label>Prioridad:</label>
                    <label className="authorLabel">Autor/a:</label>
                    <input required className="authorInput" name="author" type="text" value={this.state.author} onChange={this.handleTextChange} />
                    <button onClick={() => {
                        console.log(this.state.title);
                        console.log(this.state.title);
                        console.log(this.state.textAnnouncement);
                        console.log(this.state.author);
                    }}>Publicar Anuncio</button>
                </form>
            </div>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <Announcement></Announcement>
                </header>
            </div >
        );
    }
}

export default App;
