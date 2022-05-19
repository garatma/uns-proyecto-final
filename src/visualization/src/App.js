import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import projectorIcon from "./icons/projector.png";
import soundIcon from "./icons/sound.png";
import disabledAccessIcon from "./icons/disabledAccess.png";
import wifiIcon from "./icons/wifi.png";
import ethernetIcon from "./icons/ethernet.png";

const dateFormat = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    timezone: "ART"
};

const timeFormat = {
    hour: "numeric",
    minute: "numeric"
};

function Resources(props) {
    let projector = props.projector ? <img src={projectorIcon} className="icon" alt="icon" /> : null;
    let sound = props.sound ? <img src={soundIcon} className="icon" alt="icon" /> : null;
    let disabledAccess = props.disableAccess ? <img src={disabledAccessIcon} className="icon" alt="icon" /> : null;
    let wifi = props.wifi ? <img src={wifiIcon} className="icon" alt="icon" /> : null;
    let ethernet = props.ethernet ? <img src={ethernetIcon} className="icon" alt="icon" /> : null;

    return (
        <div>
            {projector}
            {sound}
            {disabledAccess}
            {wifi}
            {ethernet}
        </div>
    );
}

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
        return (
            <div>
                {this.state.date.toLocaleString("es-AR", dateFormat) + " — " + this.state.date.toLocaleTimeString()}
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            event_table: null,
            events_per_hour: null
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
        for (let i = 0; i < 23; i++) {
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
                    event_table: json,
                    events_per_hour: this.getEventCountWithSameHour(json)
                });
            })
            .catch((razon) => console.log("no se pudo hacer el request: " + razon));
    }

    getEventState(timestamp_event_begin, timestamp_event_end) {
        let now = new Date();
        let begin_date = new Date(timestamp_event_begin * 1000);
        let end_date = new Date(timestamp_event_end * 1000);
        if (now > end_date) return "Finalizado";
        else if (now < begin_date) return "No Empezó";
        else return "En Progreso";
    }

    fromNumberToHour(hourNumber) {
        if (hourNumber < 12) return hourNumber + ":00 AM";
        else return hourNumber + ":00 PM";
    }

    render() {
        let eventList =
            this.state.events_per_hour == null
                ? null
                : this.state.events_per_hour.map((event, index) => {
                      const records = Object.values(event.records);
                      const eventRows = records.map((row, i) => {
                          const eventHour =
                              i === 0 ? (
                                  <td rowSpan={records.length + 1}>{this.fromNumberToHour(event.hour)}</td>
                              ) : null;
                          return (
                              <tr key={i}>
                                  {eventHour}
                                  <td> {row.event_name} </td>
                                  <td> {row.room_name} </td>
                                  <td>
                                      {new Date(row.event_timestamp_begin * 1000).toLocaleTimeString(
                                          "en-US",
                                          timeFormat
                                      )}
                                  </td>
                                  <td>
                                      {new Date(row.event_timestamp_end * 1000).toLocaleTimeString("en-US", timeFormat)}
                                  </td>
                                  <td> {row.event_host} </td>
                                  <td> {row.event_attendance + "%"} </td>
                                  <td> {this.getEventState(row.event_timestamp_begin, row.event_timestamp_end)} </td>
                                  <td>
                                      <Resources
                                          projector={row.room_has_projector}
                                          sound={row.room_has_sound_equipment}
                                          disableAccess={row.room_has_disabled_access}
                                          wifi={row.room_has_wifi}
                                          ethernet={row.room_has_ethernet}
                                      />
                                  </td>
                              </tr>
                          );
                      });
                      return (
                          <tbody key={index} className={event.hour}>
                              {eventRows}
                          </tbody>
                      );
                  });

        return (
            <div className="App">
                <header className="App-header">
                    <table className="table table-dark">
                        <thead className="thead-primary">
                            <tr>
                                <th colSpan="9">
                                    <Clock />
                                </th>
                            </tr>
                            <tr className="table-warning">
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
                        {eventList}
                    </table>
                </header>
            </div>
        );
    }
}

export default App;
