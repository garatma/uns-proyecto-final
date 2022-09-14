import "./Clock.css";
import React from "react";

//This component displays the actual day and hour with the following format:
//[Day of week] [Day of month] [month] [hh:mm:ss]

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
        else if (this.props.type === "time") text = this.state.date.toLocaleTimeString("es-AR");

        return <div className={this.props.type}>{text}</div>;
    }
}

export default Clock;
