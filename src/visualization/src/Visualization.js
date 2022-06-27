import "./Visualization.css";
import React from "react";
import logo from "./icons/logo.png";
import Clock from "./clock/Clock.js";
import Row from "./Row.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import AnnouncementsToShow from "./announcement/Announcement.js";

class Visualization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventTable: null,
            carouselTableIndex: 0,
            carouselActivated: true,
            rowsToShow: []
        };
    }

    componentDidMount() {
        fetch("/backend/room-event")
            .then((response) => response.json())
            .then((json) => {
                this.setState({
                    eventTable: json
                });
            })
            .catch((reason) => console.log("couldn't make request to get events and rooms: " + reason));

        this.interval = setInterval(() => this.tick(), 3000);
    }

    tick() {
        if (this.state.carouselActivated) {
            this.setState((prevState) => ({
                carouselTableIndex: prevState.carouselTableIndex + 1
            }));
        } else {
            this.setState({
                carouselTableIndex: 0
            });
        }
        this.setRows();
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

    createEmptyRow() {
        return (
            <Row
                eventTimestampBegin={null}
                eventName={null}
                eventHost={null}
                eventAttendance={null}
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

    updateAnimationState(newState) {
        this.setState({ carouselActivated: newState });
    }

    setRows() {
        if (this.state.eventTable == null) return null;

        const maxRowCount = 9;
        let rowCount = 0;
        let lastEventAlreadyDisplayed = false;
        let rows = [];
        let totalEvents = this.state.eventTable.length;

        for (let i = this.state.carouselTableIndex; i < this.state.eventTable.length && rowCount < maxRowCount; i++) {
            const element = this.state.eventTable[i];

            rowCount++;
            if (element.event_id === this.state.eventTable[totalEvents - 1].event_id) {
                lastEventAlreadyDisplayed = true;
                console.log(element.event_name);
            }

            rows.push(
                <Row
                    eventTimestampBegin={this.setTimestamp(element.event_timestamp_begin)}
                    eventName={element.event_name}
                    eventHost={element.event_host}
                    eventAttendance={element.event_attendance + "%"}
                    eventTimestampEnd={this.setTimestamp(element.event_timestamp_end)}
                    roomName={element.room_name}
                    hasProjector={element.room_has_projector}
                    hasSoundEquipment={element.room_has_sound_equipment}
                    hasDisabledAccess={element.room_has_disabled_access}
                    hasWifi={element.room_has_wifi}
                    hasEthernet={element.room_has_ethernet}
                />
            );
        }

        for (let i = rowCount; i < maxRowCount; i++) {
            rows.push(this.createEmptyRow());
        }

        if (totalEvents > maxRowCount) {
            this.updateAnimationState(true);
            if (lastEventAlreadyDisplayed) {
                this.updateAnimationState(false);
            }
        } else this.updateAnimationState(false);

        this.setState({ rowsToShow: rows });
    }

    getRows() {
        return <tbody>{this.state.rowsToShow}</tbody>;
    }

    render() {
        let rows = this.getRows();

        return (
            <div className="Visualization">
                <header className="Visualization-header">
                    <Table className="table table-light">
                        <thead className="thead-primary">
                            <tr>
                                <th className="logo" colSpan="3">
                                    <img src={logo} className="icon" alt="icon" />
                                </th>
                                <th colSpan="4" className="date">
                                    <Clock type="date" />
                                </th>
                                <th colSpan="1" className="time">
                                    <Clock type="time" />
                                </th>
                            </tr>
                            <tr>
                                <th>Inicio</th>
                                <th>Evento</th>
                                <th>Espacio</th>
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
