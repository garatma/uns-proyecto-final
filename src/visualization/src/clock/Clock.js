import "./Clock.css";
import React from "react";

const dateFormat = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    timezone: "ART"
};

//This component displays the actual day and hour with the following format:
//[Day of week] [Day of month] [month] [hh:mm:ss]

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }

    // Set a timer to call a function every second to update the current date
    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({ date: new Date() });
    }

    // Render the current date with the es-AR format
    render() {
        let text = null;
        if (this.props.type === "date") text = this.state.date.toLocaleString("es-AR", dateFormat);
        else if (this.props.type === "time") text = this.state.date.toLocaleTimeString("es-AR");

        return <div className={this.props.type}>{text}</div>;
    }
}

export default Clock;
