import "./Admin";
import React from "react";

const timeFormat = {
    hour: "numeric",
    minute: "numeric"
};

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
        return new Date(timestamp * 1000).toLocaleString("es-AR");
    }

    handleInputChange(event) {
        let target = event.type === "checkbox" ? event.target.checked : event.target.value;
        if (target) {
            this.props.onRowSelection(event.target.value);
        }
    }

    setRows() {
        const rows = this.state.announcementTable.map(row => {
            let drawAction = null;
            if (this.props.action === "Eliminar") {
                drawAction = <input
                    className="selectRowCheckbox" type="checkbox" value={row.id} onChange={this.handleInputChange}></input>
            }
            else if (this.props.action === "Editar")
                drawAction = <button className="selectRowButton" value={row.id} onClick={this.handleInputChange}>Editar</button>
            else drawAction = null;

            return (<tr key={row.id}>
                <td>{row.title}</td>
                <td>{row.message}</td>
                <td>{this.setTimestamp(row.timestamp_begin)}</td>
                <td>{this.setTimestamp(row.timestamp_end)}</td>
                <td>{row.priority}</td>
                <td>{row.writer}</td>
                <td>{drawAction}</td>
            </tr>);
        })
        return <tbody>{rows}</tbody>;
    }

    render() {
        var rows = this.state.announcementTable != null ? this.setRows() : null;

        return (
            <div>
                <table className="announcementTable">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Mensaje</th>
                            <th>Desde</th>
                            <th>Hasta</th>
                            <th>Prioridad</th>
                            <th>Autor/a</th>
                            {this.props.action !== "" ? <th>{this.props.action}</th> : null}
                        </tr>
                    </thead>
                    {rows}
                </table >
            </div>

        );
    }
}


export default ReadAnnouncement;