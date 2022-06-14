import "./Weather.css";
import React from "react";

class Weather extends React.Component {
    constructor(props) {
        super(props);
        this.state = { weather: "" };
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 600000);
        this.tick();
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        fetch("https://wttr.in/?format=3")
            .then((response) => response.text())
            .then((text) => this.setState({ weather: text }))
            .catch((cause) => console.log("couldn't get the weather: " + cause));
    }

    render() {
        return <div className="weather">{this.state.weather}</div>;
    }
}

export default Weather;
