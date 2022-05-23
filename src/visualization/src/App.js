import "./App.css";
import React from "react";
import logo from "./icons/logo.png";
import Clock from "./clock/Clock.js";
import Row from "./Row.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Alert from "react-bootstrap/Alert";
import Carousel from "react-bootstrap/Carousel";
import Table from 'react-bootstrap/Table';



const timeFormat = {
    hour: "numeric",
    minute: "numeric"
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventTable: null,
            eventsPerHour: null
        };
    }

    recordsPerHour(hour, json) {
        let recordPerHour = [];
        json.forEach((element) => {
            var date = new Date(element.event_timestamp_begin * 1000);
            if (date.getHours() === hour) {
                recordPerHour.push(element);
            }
        });
        return recordPerHour;
    }

    getEventCountWithSameHour(json) {
        if (json == null) return null;
        let eventsPerHour = [];
        for (let i = 0; i < 24; i++) {
            eventsPerHour.push({ hour: i, records: null });
        }

        eventsPerHour.forEach((element) => {
            element.records = this.recordsPerHour(element.hour, json);
        });

        return eventsPerHour;
    }

    componentDidMount() {
        fetch("/backend/room-event")
            .then((response) => response.json())
            .then((json) => {
                this.setState({
                    eventTable: json,
                    eventsPerHour: this.getEventCountWithSameHour(json)
                });
            })
            .catch((razon) => console.log("no se pudo hacer el request: " + razon));
    }

    fromNumberToHour(hourNumber) {
        if (hourNumber < 12) return hourNumber + ":00 AM";
        else return hourNumber + ":00 PM";
    }

    setTimestamp(timestamp) {
        return new Date(timestamp * 1000).toLocaleTimeString("en-US", timeFormat);
    }

    setRows() {
        if (this.state.eventsPerHour == null) return null;

        let rows = this.state.eventsPerHour.map((hourBlock, index) => {
            const records = Object.values(hourBlock.records);
            const events = records.map((event, index2) => {
                return (
                    <Row
                        timeBlock={this.fromNumberToHour(hourBlock.hour)}
                        eventsPerTimeBlock={records.length + 1}
                        drawTimeBlock={index2 === 0 ? true : false}
                        eventName={event.event_name}
                        eventHost={event.event_host}
                        eventAttendance={event.event_attendance + "%"}
                        eventTimestampBegin={this.setTimestamp(event.event_timestamp_begin)}
                        eventTimestampEnd={this.setTimestamp(event.event_timestamp_end)}
                        roomName={event.room_name}
                        hasProjector={event.room_has_projector}
                        hasSoundEquipment={event.room_has_sound_equipment}
                        hasDisabledAccess={event.room_has_disabled_access}
                        hasWifi={event.room_has_wifi}
                        hasEthernet={event.room_has_ethernet}
                    />
                );
            });
            return <tbody>{events}</tbody>;
        });

        return rows;
    }

    render() {
        let rows = this.setRows();

        return (
            <div className="App">
                <header className="App-header">
                    <Table className="table table-light">
                        <thead className="thead-primary">
                            <tr>
                                <th className="logo" colSpan="3">
                                    <img src={logo} className="icon" alt="icon" />
                                </th>
                                <th colSpan="5" className="date">
                                    <Clock type="date" />
                                </th>
                                <th colSpan="1" className="time">
                                    <Clock type="time" />
                                </th>
                            </tr>
                            <tr>
                                <th></th>
                                <th>Evento</th>
                                <th>Espacio</th>
                                <th>Inicio</th>
                                <th>Fin</th>
                                <th>Persona a cargo</th>
                                <th>Ocupación</th>
                                <th>Estado</th>
                                <th>Recursos</th>
                            </tr>
                        </thead>
                        {rows}
                    </Table>


                    <Carousel variant="dark" autoPlay={true}
                        interval={10000}  //null para desactivarlo
                        controls={false}
                        indicatorsLabels={true}>

                        <Carousel.Item >
                            <Alert variant="success">
                                <Alert.Heading class="heading">Recordatorio 1</Alert.Heading>
                                <p>
                                    Aww yeah, you successfully read this important alert message. This example text is
                                    going to run a bit longer so that you can see how spacing within an alert works with
                                    this kind of content.
                                </p>
                            </Alert>
                        </Carousel.Item>

                        <Carousel.Item>
                            <Alert variant="danger">
                                <Alert.Heading class="heading">Recordatorio 2</Alert.Heading>
                                <p>
                                    Aww yeah, you successfully read this important alert message. This example text is
                                    going to run a bit longer so that you can see how spacing within an alert works with
                                    this kind of content.
                                </p>
                            </Alert>
                        </Carousel.Item>

                        <Carousel.Item>
                            <Alert variant="warning">
                                <Alert.Heading class="heading">Recordatorio 3</Alert.Heading>
                                <p>
                                    Aww yeah, you successfully read this important alert message. This example text is
                                    going to run a bit longer so that you can see how spacing within an alert works with
                                    this kind of content.
                                </p>
                            </Alert>
                        </Carousel.Item>
                    </Carousel>

                </header>
            </div>
        );
    }
}

export default App;
