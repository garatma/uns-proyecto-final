import "./Visualization.css";
import React from "react";
import logo from "./icons/logo.png";
import Clock from "./clock/Clock.js";
import Row from "./Row.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import AnnouncementsToShow from "./announcement/Announcement.js";
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import 'animate.css';


class Visualization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventTable: null,
            eventsPerHour: null,
            carouselTableIndex: 0,
            carouselActivated: false
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
        for (let i = 8; i < 22; i++) {
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
            .catch((reason) => console.log("couldn't make request to get events and rooms: " + reason));

        this.interval = setInterval(() => this.tick(), 3000);
    }

    tick() {
        if (this.state.carouselActivated) {
            this.setState((prevState) => ({ carouselTableIndex: prevState.carouselTableIndex + 1 }));
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    fromNumberToHour(hourNumber) {
        if (hourNumber < 12) return hourNumber + ":00 AM";
        else return hourNumber + ":00 PM";
    }

    setTimestamp(timestamp) {
        return new Date(timestamp * 1000);
    }

    setRows() {
        let rowCount = 0;
        if (this.state.eventsPerHour == null) return null;

        const maxRowCount = 7;
        let indexRow = 0;
        let firstRow = 0;
        let rowCountOfHourBlock = 0;
        let hourBlock = 0;
        let firstHour = 0;

        let now = 11;//new Date().getHours();
        let minHourBlock = now - 2;
        let maxHourBlock = now + 2;

        if (now > 12)
            firstHour = minHourBlock - 8; //porque la fila 0 es la hora 8

        let rowsFor = [];
        for (let i = firstHour; i < this.state.eventsPerHour.length && rowCount < maxRowCount; i++) {
            firstRow = 0;
            rowCountOfHourBlock = 0;
            const element = this.state.eventsPerHour[i];
            hourBlock = element.hour;
            let records = Object.values(element.records);
            if (records.length === 0) {
                if (indexRow < this.state.carouselTableIndex) indexRow++;
                else {
                    rowCount++;
                    rowsFor.push(
                        <Row
                            timeBlock={this.fromNumberToHour(element.hour)}
                            eventsPerTimeBlock={1}
                            drawTimeBlock={true}
                            eventName={null}
                            eventHost={null}
                            eventAttendance={null}
                            eventTimestampBegin={null}
                            eventTimestampEnd={null}
                            roomName={null}
                            hasProjector={null}
                            hasSoundEquipment={null}
                            hasDisabledAccess={null}
                            hasWifi={null}
                            hasEthernet={null}
                        />
                    );
                }
            } else {
                for (let j = 0; j < records.length; j++) {
                    if (indexRow < this.state.carouselTableIndex) {
                        rowCountOfHourBlock++;
                        indexRow++;
                    }
                    else {
                        const record = records[j];
                        rowCount++;
                        rowsFor.push(
                            <Row
                                timeBlock={this.fromNumberToHour(element.hour)}
                                eventsPerTimeBlock={records.length - rowCountOfHourBlock}
                                drawTimeBlock={firstRow === 0 ? true : false}
                                eventName={record.event_name}
                                eventHost={record.event_host}
                                eventAttendance={record.event_attendance + "%"}
                                eventTimestampBegin={this.setTimestamp(record.event_timestamp_begin)}
                                eventTimestampEnd={this.setTimestamp(record.event_timestamp_end)}
                                roomName={record.room_name}
                                hasProjector={record.room_has_projector}
                                hasSoundEquipment={record.room_has_sound_equipment}
                                hasDisabledAccess={record.room_has_disabled_access}
                                hasWifi={record.room_has_wifi}
                                hasEthernet={record.room_has_ethernet}
                            />
                        );

                        firstRow++;
                    }
                }
            }
        }

        if (hourBlock <= maxHourBlock && maxHourBlock < 22) { //no llego a mostrarse todo
            this.setState({ carouselActivated: true });
        }
        else {
            this.setState({ carouselActivated: false });
            this.setState({ carouselTableIndex: minHourBlock - 8 });
            this.setState({ carouselActivated: true });
        }

        let rows = this.state.eventsPerHour.map((hourBlock) => {
            let records = Object.values(hourBlock.records);

            let now = new Date();
            let min = now.getHours() - 3;
            let max = now.getHours() + 3;
            if (now.getHours() === 8) max += 2;
            if (now.getHours() === 9) max += 1;
            if (now.getHours() === 21) min -= 2;
            if (now.getHours() === 20) min -= 1;

            // if (rowCount > 6) return null;
            if (records.length === 0 && hourBlock.hour >= min && hourBlock.hour < max) {
                rowCount++;
                return (
                    <tbody>
                        <Row
                            timeBlock={this.fromNumberToHour(hourBlock.hour)}
                            eventsPerTimeBlock={0}
                            drawTimeBlock={true}
                            eventName={null}
                            eventHost={null}
                            eventAttendance={null}
                            eventTimestampBegin={null}
                            eventTimestampEnd={null}
                            roomName={null}
                            hasProjector={null}
                            hasSoundEquipment={null}
                            hasDisabledAccess={null}
                            hasWifi={null}
                            hasEthernet={null}
                        />
                    </tbody>
                );
            }

            const events = records.map((event, index2) => {
                rowCount++;

                if (hourBlock.hour < min || hourBlock.hour >= max) return null;
                return (
                    <Row
                        timeBlock={this.fromNumberToHour(hourBlock.hour)}
                        eventsPerTimeBlock={records.length}
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

        console.log("cant filas totales:  " + rowCount);
        return <tbody>{rowsFor}</tbody>;
    }

    limitRowsToShow(rows) {
        let rowsLimited = [];
        //o hacer un for en vez de un map y se cambien los limites de recorrido segun un estado.
    }

    render() {
        let rows = this.setRows();
        //rows = this.limitRowsToShow(rows);

        return (
            <div className="Visualization">
                <header className="Visualization-header">
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

                    <AnnouncementsToShow></AnnouncementsToShow>
                </header>
            </div>
        );
    }
}

export default Visualization;
