import React from "react";
import Table from "./shared/Table";
import Form from "./shared/Form";

class UpdateAnnouncement extends React.Component {
    constructor(props) {
        super(props);

        this.handleUpdateSelection = this.handleUpdateSelection.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goBack = this.goBack.bind(this);

        this.state = {
            gui: <Table action="update" handleUpdateSelection={this.handleUpdateSelection} />,
            showTable: true
        };
    }

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

    async handleSubmit(data) {
        if (data.timestamp_end <= data.timestamp_begin) {
            alert("La fecha de inicio debe ser anterior a la de fin!");
            return;
        }

        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

        let response = await fetch("/backend/announcement/", options);
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

    goBack() {
        this.setState({
            gui: <Table action="update" handleUpdateSelection={this.handleUpdateSelection} />,
            showTable: true
        });
    }

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
