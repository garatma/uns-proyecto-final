import React from "react";
import trashIcon from "./trash.png";
//<a href="https://www.flaticon.com/free-icons/trash-can" title="trash can icons">Trash can icons created by Freepik - Flaticon</a>
const trash = <img src={trashIcon} className="icon" alt="icon" />;

//This component displays a table with the announcement data that is acquired from the database
//Throught the properties, it receives information about the goal of the table:
//If the goal is to edit an announcement, the table has to include a column with buttons for earch row to select an annoucement and then edit it
//IF the goal is to delete annoucements, the table has to include a column with checkbox buttons for each row to select the annoucements to delete
//and a button to finally delete all the announcements selected to delete.
//If the goal is to read the current announcements, the table has to displayed only the announcement data
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

    async tick() {
        let response = await fetch("/backend/announcement");
        let json = await response.json();

        if (!response.ok) {
            alert("Se produjo un error al obtener los anuncios: " + json.error);
            return;
        }

        this.setState({
            dbTable: json
        });
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

            // row.priority cannot be null
            let priority = row.priority === "NORMAL" ? "Normal" : "Emergencia";

            return (
                <tr key={row.id}>
                    <td>{row.title}</td>
                    <td  className="messageWidth">{row.message}</td>
                    <td>{this.getTimestamp(row.timestamp_begin)}</td>
                    <td>{this.getTimestamp(row.timestamp_end)}</td>
                    <td>{priority}</td>
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
