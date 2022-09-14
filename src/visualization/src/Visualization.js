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
let FIRST = true;

//This component creates an events table with data acquired from a request to an API. 
//MAX_ROW_COUNT defines the max count of rows that can be displayed at a time, therefore limits the
//max count of events that can be visualized.
//If there are more events than the MAX_ROW_COUNT, the FIRST MAX_ROW_COUNT events are displayed, and after a 
//period of time, the FIRST event is not displayed anymore and the MAX_ROW_COUNT+1 is. This goes on until the
//last event is displayed, and then it restarts again. 
//In case that there is less events than MAX_ROW_COUNT, all of them are displayed in addition to empty rows to 
//fill the MAX_ROW_COUNT 
//In case that there are no events, MAX_ROW_COUNT empty rows are displayed. 
//TIME_RANGE defines the range of hours between the actual hour and the FIRST and last hour in which an event starts.
//FIRST defines wheather the FIRST request has been made or not.

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
        this.tickToUpdateEvents();
        this.intervalToUpdateEvents = setInterval(() => this.tickToUpdateEvents(), 60000);
        this.intervalToCarouse = setInterval(() => this.tickToCarouse(), 10000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalToUpdateEvents);
        clearInterval(this.intervalToCarouse);
    }

    tickToUpdateEvents() {
        let url = "/backend/room-event?timestamp=" + Date.now() + "&range=" + TIME_RANGE;
        fetch(url)
            .then((response) => response.json())
            .then((json) => {
                this.setState(
                    {
                        eventTable: json
                    },
                    () => {
                        if (FIRST) {
                            FIRST = false;
                            this.tickToCarouse();
                        }
                    }
                );
            })
            .catch((reason) => console.log("couldn't make request to get events and rooms: " + reason));
    }

    tickToCarouse() {
        if (this.state.carouselTableIndex === null || this.state.eventTable === null) return;

        this.setState((prevState) => ({
            carouselTableIndex:
                prevState.carouselTableIndex < prevState.eventTable.length - MAX_ROW_COUNT
                    ? prevState.carouselTableIndex + 1
                    : 0,
            rowsToShow: this.setRows()
        }));
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
