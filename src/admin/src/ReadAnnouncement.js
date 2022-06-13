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
        };
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
            .then((json) =>
                this.setState({
                    announcementTable: json
                })
            )
            .catch((cause) => console.log("couldn't get announcement info: " + cause));
    }

    setTimestamp(timestamp) {
        return new Date(timestamp * 1000).toLocaleTimeString("en-US", timeFormat);
    }

    handleInputChange(event) {
        if (event.target.checked) {
            this.props.onRowSelection(event.target.value);
        }
    }

    setRows() {
        const rows = this.state.announcementTable.map((row) => {
            let drawAction = null;
            if (this.props.action !== "") {
                drawAction = (
                    <input
                        className="selectRow"
                        type="checkbox"
                        value={row.id}
                        onChange={this.handleInputChange}
                    ></input>
                );
            } else drawAction = null;

            return (
                <tr key={row.id}>
                    <td>{row.title}</td>
                    <td>{row.message}</td>
                    <td>{this.setTimestamp(row.timestamp_begin)}</td>
                    <td>{this.setTimestamp(row.timestamp_end)}</td>
                    <td>{row.priority}</td>
                    <td>{row.writer}</td>
                    {drawAction}
                </tr>
            );
        });
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
            </table>
        );
    }
}

export default ReadAnnouncement;
