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

    handleUpdateSelection(event) {
        fetch("/backend/announcement/" + event.target.value)
            .then((response) => response.json())
            .then((json) => {
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
            })
            .catch((cause) => console.log("couldn't get announcement info: " + cause));
    }

    handleSubmit(data) {
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

        // TODO: handle code 413 (payload too large)
        fetch("/backend/announcement/", options)
            .then((response) => response.text())
            .then((text) => console.log(text))
            .catch((cause) => console.log("couldn't update announcement form: " + cause));
    }

    goBack() {
        this.setState({
            gui: <Table action="update" handleUpdateSelection={this.handleUpdateSelection} />,
            showTable: true
        });
    }

    render() {
        let goBackButton = this.state.showTable ? null : <button onClick={this.goBack}>Volver a la tabla</button>;

        return (
            <div>
                {this.state.gui}
                {goBackButton}
            </div>
        );
    }
}

export default UpdateAnnouncement;
