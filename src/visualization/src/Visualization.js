import "./Visualization.css";
import React from "react";
import logo from "./icons/logo.png";
import Clock from "./clock/Clock.js";
import Row from "./Row.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import AnnouncementsToShow from "./announcement/Announcement.js";

const TIME_RANGE = 2;

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
        let now = new Date();
        let route =
            "/backend/room-event?day_of_week=" + now.getDay() + "&range=" + TIME_RANGE + "&hours=" + now.getUTCHours();
        fetch(route)
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

    createEmptyRow(i) {
        return (
            <Row
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

    updateAnimationState(newState) {
        this.setState({ carouselActivated: newState });
    }

    setColorToRow(index) {
        let color = "color1";
        index % 2 === 0 ? (color = "color1") : (color = "color2");
        return color;
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
                    color={this.setColorToRow(i)}
                    eventHoursBegin={element.event_hours_begin}
                    eventMinutesBegin={element.event_minutes_begin}
                    eventHoursEnd={element.event_hours_end}
                    eventMinutesEnd={element.event_minutes_end}
                    eventName={element.event_name}
                    eventHost={element.event_host}
                    eventAttendance={element.event_attendance + "%"}
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
            rows.push(this.createEmptyRow(i));
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
                    <Table className="EventTable">
                        <thead className="thead-primary">
                            <tr>
                                <th className="logo" colSpan="2">
                                    <img src={logo} className="blackIcons" alt="icon" />
                                </th>
                                <th colSpan="4" className="date">
                                    <Clock type="date" />
                                </th>
                                <th colSpan="2" className="time">
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
