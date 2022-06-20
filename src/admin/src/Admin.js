import "./Admin.css";
import React from "react";
import CreateAnnouncement from "./crud/CreateAnnouncement";
import ReadAnnouncement from "./crud/ReadAnnouncement";
import UpdateAnnouncement from "./crud/UpdateAnnouncement";
import DeleteAnnouncement from "./crud/DeleteAnnouncement.js";

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
                    {this.state.gui}
                </header>
            </div>
        );
    }
}

export default Admin;
