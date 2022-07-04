import React from "react";
import trashIcon from "./trash.png";
//<a href="https://www.flaticon.com/free-icons/trash-can" title="trash can icons">Trash can icons created by Freepik - Flaticon</a>
const trash = <img src={trashIcon} className="icon" alt="icon" />;


class Table extends React.Component {
    constructor(props) {
        super(props);

        this.tick = this.tick.bind(this);
        this.getHeader = this.getHeader.bind(this);

        this.state = {
            dbTable: null,
            lastHeader: this.getHeader()
        };
    }

    getHeader() {
        if (this.props.action === "update") return <th>Editar</th>;
        else if (this.props.action === "delete") return <th>Eliminar</th>;
    }

    alertUser() {
        alert("You clicked!");
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
                    dbTable: json
                })
            )
            .catch((cause) => console.log("couldn't get announcement info: " + cause));
    }

    getTimestamp(timestamp) {
        return new Date(timestamp * 1000).toLocaleString("es-AR");
    }

    getTable() {
        const rows = this.state.dbTable.map((row) => {
            let actionColumn = null;

            if (this.props.action === "update") {
                actionColumn = (
                    <td>
                        <button className="selectRowButton" value={row.id} onClick={this.props.handleUpdateSelection}>
                            Editar
                        </button>
                    </td>
                );
            } else if (this.props.action === "delete") {
                actionColumn = (
                    <td>
                        <input
                            className="selectRowCheckbox"
                            type="checkbox"
                            value={row.id}
                            onChange={this.props.handleDeleteSelection}
                        ></input>
                    </td>
                );
            }

            return (
                <tr key={row.id}>
                    <td>{row.title}</td>
                    <td>{row.message}</td>
                    <td>{this.getTimestamp(row.timestamp_begin)}</td>
                    <td>{this.getTimestamp(row.timestamp_end)}</td>
                    <td>{row.priority}</td>
                    <td>{row.writer}</td>
                    {actionColumn}
                </tr>
            );
        });
        return <tbody>{rows}</tbody>;
    }

    render() {
        const table = this.state.dbTable != null ? this.getTable() : null;

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
                            {this.state.lastHeader}
                        </tr>
                    </thead>
                    {table}
                    <tbody>
                        {this.props.action === "delete" ?
                            <tr><td className="deleteSelectionRow" colSpan={7}><button className="deleteSelection" onClick={this.props.actionButton}>{trash}</button></td></tr> : null}

                    </tbody>
                </table>
            </div>
        );
    }
}

export default Table;
