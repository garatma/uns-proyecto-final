import "./App.css";
import React from "react";

const timeFormat = {
    hour: "numeric",
    minute: "numeric"
};

let rowsSelected = [];

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

    toEpoch() { }

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

                    <label className="PriorityLabel">Prioridad:
                        <Priority onChange={this.handlePriorityChange} value={this.state.priority} />
                    </label>

                    <label className="authorLabel">Autor/a:</label>
                    <input
                        required
                        className="authorInput"
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


class ReadAnnouncement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            announcementTable: null
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
        this.tick();
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        fetch("/backend/announcement/")
            .then((response) => response.json())
            .then((json) => this.setState({
                announcementTable: json
            }))
            .catch((cause) => console.log("couldn't get announcement info: " + cause));
    }

    setTimestamp(timestamp) {
        return new Date(timestamp * 1000).toLocaleTimeString("en-US", timeFormat);
    }

    handleInputChange() { //obtener la fila asociada al checkbox

    }

    setRows() {
        const rows = this.state.announcementTable.map(row => {
            let drawAction = null;// = this.props.action !== "" ? <input className="selectRow" type="checkbox"></input> : null;
            if (this.props.action !== "") {
                drawAction = <input
                    className="selectRow" type="checkbox" onChange={this.handleInputChange}></input>
            }
            else drawAction = null;

            return (<tr>
                <td>{row.title}</td>
                <td>{row.message}</td>
                <td>{this.setTimestamp(row.timestamp_begin)}</td>
                <td>{this.setTimestamp(row.timestamp_end)}</td>
                <td>{row.priority}</td>
                <td>{row.writer}</td>
                {drawAction}
            </tr>);
        })
        return rows;
    }

    render() {
        var rows = this.state.announcementTable != null ? this.setRows() : null;

        return (
            <table className="announcementTable">
                <thead>
                    <th>Título</th>
                    <th>Mensaje</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th>Prioridad</th>
                    <th>Autor/a</th>
                    {this.props.action !== "" ? <th>{this.props.action}</th> : null}
                </thead>
                <tbody>{rows}</tbody>
            </table >
        );
    }
}

class Delete extends React.Component {
    render() {
        return (
            <div>
                <ReadAnnouncement action={"Eliminar"} />
                <button className="deleteButton">Eliminar</button>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gui: null
        };

        this.handleCreateAnnouncement = this.handleCreateAnnouncement.bind(this);
        this.handleSeeAnnouncements = this.handleSeeAnnouncements.bind(this);
        this.handleDeleteAnnouncement = this.handleDeleteAnnouncement.bind(this);
    }

    handleCreateAnnouncement(event) {
        this.setState({
            gui: <Announcement></Announcement>
        });
    }

    handleDeleteAnnouncement(event) {
        this.setState({
            gui: <Delete />
        });

    }

    handleSeeAnnouncements(event) {
        this.setState({
            gui: <ReadAnnouncement action={""} />
        });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div className="menuAnnouncement">
                        <button onClick={this.handleCreateAnnouncement}>Crear Anuncio</button>

                        <button onClick={this.handleSeeAnnouncements}>Ver Anuncios</button>

                        <button>Editar Anuncio</button>

                        <button onClick={this.handleDeleteAnnouncement}>Eliminar Anuncio</button>

                    </div>
                    {this.state.gui}
                </header >
            </div >
        );
    }
}

export default App;
