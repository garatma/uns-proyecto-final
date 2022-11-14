import "./Admin.css";
import React from "react";
import CreateAnnouncement from "./crud/CreateAnnouncement";
import ReadAnnouncement from "./crud/ReadAnnouncement";
import UpdateAnnouncement from "./crud/UpdateAnnouncement";
import DeleteAnnouncement from "./crud/DeleteAnnouncement.js";

//This component displays buttons to create, delete, edit and visualize announcements.
//When these are clicked, they redirect to the component that handles their functionality.
class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gui: null
        };

        this.handleCreateAnnouncement = this.handleCreateAnnouncement.bind(this);
        this.handleReadAnnouncements = this.handleReadAnnouncements.bind(this);
        this.handleUpdateAnnouncement = this.handleUpdateAnnouncement.bind(this);
        this.handleDeleteAnnouncement = this.handleDeleteAnnouncement.bind(this);
    }

    handleCreateAnnouncement() {
        this.setState({ gui: <CreateAnnouncement /> });
    }

    handleReadAnnouncements() {
        this.setState({ gui: <ReadAnnouncement /> });
    }

    handleUpdateAnnouncement() {
        this.setState({ gui: <UpdateAnnouncement /> });
    }

    handleDeleteAnnouncement() {
        this.setState({ gui: <DeleteAnnouncement /> });
    }

    //Render four buttons, each one with their respective callback function.
    render() {
        return (
            <div className="Admin">
                <header className="Admin-header">
                    <div className="menuAnnouncement">
                        <button onClick={this.handleCreateAnnouncement}>Crear Anuncio</button>
                        <button onClick={this.handleReadAnnouncements}>Ver Anuncios</button>
                        <button onClick={this.handleUpdateAnnouncement}>Editar Anuncio</button>
                        <button onClick={this.handleDeleteAnnouncement}>Eliminar Anuncio</button>
                    </div>
                </header>
                <div>{this.state.gui}</div>
            </div>
        );
    }
}

export default Admin;
