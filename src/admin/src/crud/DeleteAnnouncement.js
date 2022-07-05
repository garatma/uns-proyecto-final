import React from "react";
import Table from "./shared/Table";

class DeleteAnnouncement extends React.Component {
    constructor(props) {
        super(props);

        this.handleDeleteSelection = this.handleDeleteSelection.bind(this);
        this.deleteSelectedAnnouncement = this.deleteSelectedAnnouncement.bind(this);

        this.state = {
            announcementsToDelete: []
        };
    }

    handleDeleteSelection(event) {
        if (event.target.checked)
            this.setState((state) => ({ announcementsToDelete: state.announcementsToDelete.concat(event.target.value) }));
        else {
            let indexId = this.state.announcementsToDelete.findIndex(id => id === event.target.value);
            this.state.announcementsToDelete.splice(indexId, 1);
        }
    }

    async deleteSelectedAnnouncement() {
        const ids = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state.announcementsToDelete)
        };

        let response = await fetch("/backend/announcement", ids);
        if (response.ok) {
            if (this.state.announcementsToDelete.length === 1) alert("Anuncio eliminado!");
            else alert("Anuncios eliminados!");
            return;
        }

        let json = await response.json();
        alert("Se produjo un error al eliminar el anuncio: " + json.error);
    }

    render() {
        return (
            <Table action="delete" handleDeleteSelection={this.handleDeleteSelection} actionButton={this.deleteSelectedAnnouncement} />

        );
    }
}

export default DeleteAnnouncement;
