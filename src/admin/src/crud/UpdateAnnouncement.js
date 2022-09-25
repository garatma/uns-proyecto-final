import React from "react";
import Table from "./shared/Table";
import Form from "./shared/Form";

//This component shows the current announcements to edit through the Table component (See Table.js)
//When an announcement is selected to edit, a form is displayed with the announcement data (See Form.js)
//When the announcement edition is finished, the new data is updated on the database.
class UpdateAnnouncement extends React.Component {
    constructor(props) {
        super(props);

        this.handleUpdateSelection = this.handleUpdateSelection.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goBack = this.goBack.bind(this);

        //Set the gui state to render the announcements table with the "update" mode until a
        //announcement is selected to edit
        this.state = {
            gui: <Table action="update" handleUpdateSelection={this.handleUpdateSelection} />,
            showTable: true
        };
    }


    //Get the selected announcement data and change the gui state to displayed the edit form instead of the announcement table
    async handleUpdateSelection(event) {
        let response = await fetch("/backend/announcement/id/" + event.target.value);
        let json = await response.json();

        if (!response.ok) {
            alert("Se produjo un error al obtener más información sobre el anuncio: " + json.error);
            return;
        }

        this.setState({
            gui: (
                <Form
                    title={json.title}
                    body={json.message}
                    priority={json.priority}
                    fromTimestamp={json.timestamp_begin}
                    toTimestamp={json.timestamp_end}
                    author={json.writer}
                    id={json.id}
                    photo={json.photo}
                    onSubmit={this.handleSubmit}
                />
            ),
            showTable: false
        });
    }


    // Submit the form.
    async handleSubmit(data) {
        if (data.timestamp_end <= data.timestamp_begin) {
            alert("La fecha de inicio debe ser anterior a la de fin!");
            return;
        }

        // Update the form to the backend
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

        let response = await fetch("/backend/announcement/", options);

        // Check response

        if (response.ok) {
            alert("Anuncio actualizado!");
            return;
        }

        // handle errors
        if (response.status === 409) {
            alert("Ya existe un anuncio de Emergencia durante ese período de tiempo.");
            return;
        } else if (response.status === 413) {
            alert("No se soportan imágenes de tamaño mayor a 5MB.");
            return;
        }

        let json = await response.json();
        alert("Se produjo un error al actualizar el anuncio: " + json.error);
    }

    // Change the gui state to render the announcements table with the "update" mode, instead of the edit form
    goBack() {
        this.setState({
            gui: <Table action="update" handleUpdateSelection={this.handleUpdateSelection} />,
            showTable: true
        });
    }


    // Render the gui according to the actual state:
    // As default, render the announcements table with the "update" mode, with a callback for when we have to delete the selected announcements.
    // When a Edit button is clicked, the gui state change and the edit form is displayed.
    // If the edit form is displayed, a Go Back button is displayed to return to the announcements table
    render() {
        let goBackButton = this.state.showTable ? null : <button className="goBacktoTable" onClick={this.goBack}>Volver a la tabla</button>;

        return (
            <div>
                {this.state.gui}
                {goBackButton}
            </div>
        );
    }
}

export default UpdateAnnouncement;
