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

    deleteSelectedAnnouncement() {
        const ids = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state.announcementsToDelete)
        };

        fetch("/backend/announcement/", ids)
            .then((response) => response.text())
            .then((text) => console.log(text))
            .catch((cause) => console.log("couldn't delete announcement : " + cause));
    }

    render() {
        return (
            <Table action="delete" handleDeleteSelection={this.handleDeleteSelection} actionButton={this.deleteSelectedAnnouncement} />
        );
    }
}

export default DeleteAnnouncement;
