import React from "react";

class Timestamp extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.props.onChange(event.target.name, event.target.value);
    }

    render() {
        return (
            <input
                required
                value={this.props.value}
                name={this.props.name}
                type="datetime-local"
                onChange={this.handleInputChange}
            ></input>
        );
    }
}

class Priority extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.props.onChange(event.target.value);
    }

    render() {
        return (
            <select value={this.props.value} className="priority" onChange={this.handleInputChange}>
                <option value="LOW">Baja</option>
                <option value="MID">Media</option>
                <option value="HIGH">Alta</option>
            </select>
        );
    }
}

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title != null ? this.props.title : "",
            body: this.props.body != null ? this.props.body : "",
            fromTimestamp:
                this.props.fromTimestamp != null
                    ? this.getTimestamp(new Date(this.props.fromTimestamp * 1000))
                    : this.getTimestamp(new Date()),
            toTimestamp:
                this.props.toTimestamp != null
                    ? this.getTimestamp(new Date(this.props.toTimestamp * 1000))
                    : this.getTimestamp(new Date()),
            priority: this.props.priority != null ? this.props.priority : "MID",
            author: this.props.author != null ? this.props.author : "",
            photo: "",
            photo64: this.props.photo != null ? this.props.photo : "",
            id: this.props.id != null ? this.props.id : ""
        };

        this.handleTimestampChange = this.handleTimestampChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handlePriorityChange = this.handlePriorityChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getTimestamp(timestamp) {
        let year = timestamp.getFullYear();
        let month = timestamp.getMonth() < 10 ? "0" + (timestamp.getMonth() + 1) : timestamp.getMonth() + 1;
        let day = timestamp.getDate() < 10 ? "0" + timestamp.getDate() : timestamp.getDate();
        let hours = timestamp.getHours() < 10 ? "0" + timestamp.getHours() : timestamp.getHours();
        let minutes = timestamp.getMinutes() < 10 ? "0" + timestamp.getMinutes() : timestamp.getMinutes();

        return year + "-" + month + "-" + day + "T" + hours + ":" + minutes;
    }

    handleTimestampChange(name, value) {
        if (name === "fromTimestamp") {
            this.setState({
                fromTimestamp: value
            });
        } else {
            this.setState({
                toTimestamp: value
            });
        }
    }

    handleTextChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handlePriorityChange(value) {
        this.setState({
            priority: value
        });
    }

    handleFileChange(event) {
        let file = event.target.files[0];

        this.setState({
            photo: file,
            photo64: null
        });

        // convert photo to base64
        let reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = (e) => {
            this.setState({
                photo64: e.target.result
            });
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        // if the photo is not PNG or JPG, return
        if (
            this.state.photo !== "" &&
            this.state.photo64 !== "" &&
            this.state.photo.type !== "image/png" &&
            this.state.photo.type !== "image/jpg" &&
            this.state.photo.type !== "image/jpeg"
        ) {
            alert("Nada más se soportan imágenes de tipo PNG/JPG/JPEG.");
            return;
        }

        let data = {
            title: this.state.title.trim(),
            message: this.state.body.trim(),
            writer: this.state.author.trim(),
            priority: this.state.priority.trim(),
            photo: this.state.photo64,
            timestamp_begin: parseInt(Date.parse(this.state.fromTimestamp) / 1000),
            timestamp_end: parseInt(Date.parse(this.state.toTimestamp) / 1000),
            timestamp_create: parseInt(Date.now() / 1000),
            timestamp_update: null
        };

        if (this.state.id !== "") {
            data = Object.assign(data, {
                id: this.state.id
            });
        }

        this.props.onSubmit(data);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Título:</label>
                    <input
                        required
                        name="title"
                        type="text"
                        value={this.state.title}
                        onChange={this.handleTextChange}
                    />

                    <label>Anuncio:</label>
                    <textarea required name="body" value={this.state.body} onChange={this.handleTextChange}></textarea>

                    <label>Desde:</label>
                    <Timestamp
                        value={this.state.fromTimestamp}
                        name="fromTimestamp"
                        onChange={this.handleTimestampChange}
                    />

                    <label>Hasta:</label>
                    <Timestamp
                        value={this.state.toTimestamp}
                        name="toTimestamp"
                        onChange={this.handleTimestampChange}
                    />

                    <label className="PriorityLabel">
                        Prioridad:
                        <Priority onChange={this.handlePriorityChange} value={this.state.priority} />
                    </label>

                    <label className="authorLabel">Autor/a:</label>
                    <input
                        required
                        className="authorInput"
                        name="author"
                        type="text"
                        value={this.state.author}
                        onChange={this.handleTextChange}
                    />

                    <label>
                        Foto:
                        <input type="file" onChange={this.handleFileChange} />
                        <img src={this.state.photo64} className="photo" alt="" />
                    </label>

                    <button>Publicar</button>
                </form>
            </div>
        );
    }
}

export default Form;