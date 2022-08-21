import "./Visualization.css";
import React from "react";
import logo from "./icons/logo.png";
import Clock from "./clock/Clock.js";
import Row from "./row/Row.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import AnnouncementsToShow from "./announcement/Announcement.js";

const TIME_RANGE = 2;
const MAX_ROW_COUNT = 12;

class Visualization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventTable: null,
            carouselTableIndex: 0,
            rowsToShow: []
        };
    }

    componentDidMount() {
        this.getEventsFromDatabase();
        this.intervalToUpdateEvents = setInterval(() => this.tickToUpdateEvents(), 60000);
        this.interval = setInterval(() => this.tick(), 10000);
    }

    getEventsFromDatabase() {
        let url = "/backend/room-event?timestamp=" + Date.now() + "&range=" + TIME_RANGE;
        fetch(url)
            .then((response) => response.json())
            .then((json) => {
                this.setState({
                    eventTable: json
                });
            })
            .catch((reason) => console.log("couldn't make request to get events and rooms: " + reason));
    }

    tickToUpdateEvents() {
        this.getEventsFromDatabase();
    }

    tick() {
        if (this.state.carouselTableIndex === null || this.state.eventTable === null) return;

        this.setState((prevState) => ({
            carouselTableIndex:
                prevState.carouselTableIndex < prevState.eventTable.length - MAX_ROW_COUNT
                    ? prevState.carouselTableIndex + 1
                    : 0,
            rowsToShow: this.setRows()
        }));
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    fromNumberToHour(hourNumber) {
        if (hourNumber < 12) return hourNumber + ":00 AM";
        else return hourNumber + ":00 PM";
    }

    createEmptyRow(i) {
        return (
            <Row
                key={i}
                color={this.setColorToRow(i)}
                eventHoursBegin={null}
                eventMinutesBegin={null}
                eventHoursEnd={null}
                eventMinutesEnd={null}
                eventName={null}
                eventHost={null}
                eventAttendance={null}
                roomName={null}
                hasProjector={null}
                hasSoundEquipment={null}
                hasDisabledAccess={null}
                hasWifi={null}
                hasEthernet={null}
            />
        );
    }

    setColorToRow(index) {
        return index % 2 === 0 ? "color1" : "color2";
    }

    setRows() {
        if (this.state.eventTable == null) return null;

        let rowCount = 0;
        let rows = [];

        for (let i = this.state.carouselTableIndex; i < this.state.eventTable.length && rowCount < MAX_ROW_COUNT; i++) {
            const element = this.state.eventTable[i];
            rowCount++;
            rows.push(
                <Row
                    key={i}
                    color={this.setColorToRow(i)}
                    eventHoursBegin={element.event_hours_begin}
                    eventMinutesBegin={element.event_minutes_begin}
                    eventHoursEnd={element.event_hours_end}
                    eventMinutesEnd={element.event_minutes_end}
                    eventName={element.event_name}
                    eventHost={element.event_host}
                    eventAttendance={element.event_attendance}
                    roomName={element.room_name}
                    hasProjector={element.room_has_projector}
                    hasSoundEquipment={element.room_has_sound_equipment}
                    hasDisabledAccess={element.room_has_disabled_access}
                    hasWifi={element.room_has_wifi}
                    hasEthernet={element.room_has_ethernet}
                />
            );
        }

        for (let i = rowCount; i < MAX_ROW_COUNT; i++) {
            rows.push(this.createEmptyRow(i));
        }

        return rows;
    }

    getRows() {
        return <tbody>{this.state.rowsToShow}</tbody>;
    }

    render() {
        let rows = this.getRows();

        return (
            <div className="Visualization">
                <header className="Visualization-header">
                    <Table className="EventTable">
                        <thead className="thead-primary">
                            <tr>
                                <th className="logo" colSpan="2">
                                    <img src={logo} className="blackIcons" alt="icon" />
                                </th>
                                <th colSpan="5" className="date">
                                    <Clock type="date" />
                                </th>
                                <th colSpan="1" className="time">
                                    <Clock type="time" />
                                </th>
                            </tr>
                            <tr>
                                <th>Inicio</th>
                                <th>Fin</th>
                                <th>Evento</th>
                                <th>Persona a cargo</th>
                                <th>Espacio</th>
                                <th>Ocupación</th>
                                <th>Estado</th>
                                <th>Recursos</th>
                            </tr>
                        </thead>
                        {rows}
                    </Table>
                    <AnnouncementsToShow></AnnouncementsToShow>
                </header>
            </div>
        );
    }
}

export default Visualization;
