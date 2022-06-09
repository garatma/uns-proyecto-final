import "./App.css";
import React from "react";
import ReadAnnouncement from "./ReadAnnouncement.js"

class DeleteAnnouncement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            announcementsToDelete: []
        }
        this.handleDeleteSelection = this.handleDeleteSelection.bind(this);
        this.deleteSelectedAnnouncement = this.deleteSelectedAnnouncement.bind(this);
    }

    handleDeleteSelection(announcementID) {
        this.setState(state => ({ announcementsToDelete: state.announcementsToDelete.concat(announcementID) }));

    }

    deleteSelectedAnnouncement() {
        console.log(this.state.announcementsToDelete);

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
                <ReadAnnouncement
                    action={"Eliminar"}
                    onRowSelection={this.handleDeleteSelection} />
                <button
                    className="deleteButton"
                    onClick={this.deleteSelectedAnnouncement}>{
                        this.state.announcementsToDelete}</button>
            </div>
        );
    }
}


export default DeleteAnnouncement;