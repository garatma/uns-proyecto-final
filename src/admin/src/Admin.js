import "./Admin.css";
import React from "react";

class Timestamp extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.props.onChange(event.target.name, event.target.value);
    }

    render() {
        return (
            <input
                required
                value={this.props.value}
                name={this.props.name}
                type="datetime-local"
                onChange={this.handleInputChange}
            ></input>
        );
    }
}

class Priority extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.props.onChange(event.target.value);
    }

    render() {
        return (
            <select value={this.props.value} className="priority" onChange={this.handleInputChange}>
                <option value="LOW">Baja</option>
                <option value="MID">Media</option>
                <option value="HIGH">Alta</option>
            </select>
        );
    }
}

class Announcement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            body: "",
            fromTimestamp: this.now(),
            toTimestamp: this.now(),
            priority: "MID",
            author: ""
        };

        this.handleTimestampChange = this.handleTimestampChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handlePriorityChange = this.handlePriorityChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    now() {
        let now = new Date();

        let year = now.getFullYear();
        let month = now.getMonth() < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
        let day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
        let hours = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
        let minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();

        return year + "-" + month + "-" + day + "T" + hours + ":" + minutes;
    }

    handleTimestampChange(name, value) {
        if (name === "fromTimestamp") {
            this.setState({
                fromTimestamp: value
            });
        } else {
            this.setState({
                toTimestamp: value
            });
        }
    }

    handleTextChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handlePriorityChange(value) {
        this.setState({
            priority: value
        });
    }

    toEpoch() {}

    handleSubmit(event) {
        const insert = {
            title: this.state.title,
            message: this.state.body,
            writer: this.state.author,
            priority: this.state.priority,
            timestamp_begin: parseInt(Date.parse(this.state.fromTimestamp) / 1000),
            timestamp_end: parseInt(Date.parse(this.state.toTimestamp) / 1000),
            timestamp_create: parseInt(Date.now() / 1000),
            timestamp_update: null
        };

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(insert)
        };

        fetch("/backend/announcement/", options)
            .then((response) => response.text())
            .then((text) => console.log(text))
            .catch((cause) => console.log("couldn't submit announcement form: " + cause));

        event.preventDefault();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Título:</label>
                    <input
                        required
                        name="title"
                        type="text"
                        value={this.state.title}
                        onChange={this.handleTextChange}
                    />

                    <label>Anuncio:</label>
                    <textarea required name="body" value={this.state.body} onChange={this.handleTextChange}></textarea>

                    <label>Desde:</label>
                    <Timestamp
                        value={this.state.fromTimestamp}
                        name="fromTimestamp"
                        onChange={this.handleTimestampChange}
                    />

                    <label>Hasta:</label>
                    <Timestamp
                        value={this.state.toTimestamp}
                        name="toTimestamp"
                        onChange={this.handleTimestampChange}
                    />

                    <label>Prioridad:</label>
                    <Priority onChange={this.handlePriorityChange} value={this.state.priority} />

                    <label className="authorLabel">Autor/a:</label>
                    <input
                        required
                        name="author"
                        type="text"
                        value={this.state.author}
                        onChange={this.handleTextChange}
                    />

                    <button>Publicar anuncio</button>
                </form>
            </div>
        );
    }
}

class Admin extends React.Component {
    render() {
        return (
            <div className="Admin">
                <header className="Admin-header">
                    <Announcement></Announcement>
                </header>
            </div>
        );
    }
}

export default Admin;
