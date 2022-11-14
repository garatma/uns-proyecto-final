import React from "react";
import Table from "./shared/Table";

//This component shows the current announcement through the Table component (See Table.js) and
//creates a list to gathered all the announcements that are checked to delete
//and deletes them from the database when the delete button is pressed
class DeleteAnnouncement extends React.Component {
    constructor(props) {
        super(props);

        this.handleDeleteSelection = this.handleDeleteSelection.bind(this);
        this.deleteSelectedAnnouncement = this.deleteSelectedAnnouncement.bind(this);

        this.state = {
            announcementsToDelete: []
        };
    }

    //If an announcement's checkbox is checked, the announcement's ID is added to a list that contains all the
    //announcements to delete. If an announcement's checkbox is unchecked, the announcement's ID is removed from that
    //list (to uncheck a checkbox, first it must be checked so that announcement is on the list)
    handleDeleteSelection(event) {
        if (event.target.checked)
            this.setState((state) => ({
                announcementsToDelete: state.announcementsToDelete.concat(event.target.value)
            }));
        else {
            let indexId = this.state.announcementsToDelete.findIndex((id) => id === event.target.value);
            this.state.announcementsToDelete.splice(indexId, 1);
        }
    }

    //Deletes all the announcements on the announcement to delete list
    async deleteSelectedAnnouncement() {
        // Send the DELETE request to the backend to delete the selected announcements from the database

        if (this.state.announcementsToDelete.length > 0) {
            const ids = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.state.announcementsToDelete)
            };

            let response = await fetch("/backend/announcement", ids);

            // Check response and empty the announcement to delete list

            if (response.ok) {
                if (this.state.announcementsToDelete.length === 1) alert("Anuncio eliminado!");
                else alert("Anuncios eliminados!");
                this.setState({ announcementsToDelete: [] });
                return;
            }

            let json = await response.json();
            alert("Se produjo un error al eliminar el anuncio: " + json.error);
        }
    }

    // Render the announcements table with the "delete" mode, with a callback for when we have to delete the selected announcements.
    render() {
        return (
            <Table
                action="delete"
                handleDeleteSelection={this.handleDeleteSelection}
                actionButton={this.deleteSelectedAnnouncement}
            />
        );
    }
}

export default DeleteAnnouncement;
