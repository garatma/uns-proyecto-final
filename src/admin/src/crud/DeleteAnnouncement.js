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
        this.setState((state) => ({ announcementsToDelete: state.announcementsToDelete.concat(event.target.value) }));
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
            <div>
                <Table action="delete" handleDeleteSelection={this.handleDeleteSelection} />
                <button className="deleteButton" onClick={this.deleteSelectedAnnouncement}>
                    {this.state.announcementsToDelete}
                </button>
            </div>
        );
    }
}

export default DeleteAnnouncement;
