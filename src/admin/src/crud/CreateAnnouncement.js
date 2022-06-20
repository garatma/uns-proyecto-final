import React from "react";
import Form from "./shared/Form";

class CreateAnnouncement extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(data) {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

        // TODO: handle code 413 (payload too large)
        fetch("/backend/announcement/", options)
            .then((response) => response.text())
            .then((text) => console.log(text))
            .catch((cause) => console.log("couldn't create announcement form: " + cause));
    }

    render() {
        return <Form onSubmit={this.handleSubmit} />;
    }
}

export default CreateAnnouncement;
