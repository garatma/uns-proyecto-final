import "./Clock.css";
import React from "react";

const dateFormat = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    timezone: "ART"
};

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({ date: new Date() });
    }

    render() {
        let text = null;
        if (this.props.type === "date") text = this.state.date.toLocaleString("es-AR", dateFormat);
        else if (this.props.type === "time") text = this.state.date.toLocaleTimeString();

        return <div className={this.props.type}>{text}</div>;
    }
}

export default Clock;
