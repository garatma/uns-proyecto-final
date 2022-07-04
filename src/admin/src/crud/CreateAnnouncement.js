import React from "react";
import Form from "./shared/Form";

class CreateAnnouncement extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(data) {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

        let response = await fetch("/backend/announcement/", options);
        if (response.ok) {
            alert("Anuncio creado!");
            return;
        }

        if (response.status === 409) {
            alert("Ya existe un anuncio de Emergencia durante ese período de tiempo.");
            return;
        } else if (response.status === 413) {
            alert("No se soportan imágenes de tamaño mayor a 5MB.");
            return;
        }

        let json = await response.json();
        alert("Se produjo un error al crear el anuncio: " + json.error);
    }

    render() {
        return <Form onSubmit={this.handleSubmit} />;
    }
}

export default CreateAnnouncement;
