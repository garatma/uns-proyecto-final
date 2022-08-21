import React from "react";
import Resources from "../resources/Resources.js";
import "./Row.css";

const FINALIZADO = "Finalizado";
const SIN_COMENZAR = "Sin comenzar";
const EN_PROGRESO = "En progreso";

function getEventState(hoursBegin, minutesBegin, hoursEnd, minutesEnd) {
    if (hoursBegin === null || minutesBegin === null || hoursEnd === null || minutesEnd === null) return null;

    let now = new Date();

    let timestampBegin = new Date();
    timestampBegin.setHours(hoursBegin);
    timestampBegin.setMinutes(minutesBegin);
    timestampBegin.setSeconds(0);
    timestampBegin.setMilliseconds(0);

    let timestampEnd = new Date();
    timestampEnd.setHours(hoursEnd);
    timestampEnd.setMinutes(minutesEnd);
    timestampBegin.setSeconds(0);
    timestampBegin.setMilliseconds(0);

    if (timestampBegin == null || timestampEnd == null) return null;
    if (now > timestampEnd) return FINALIZADO;
    else if (now < timestampBegin) return SIN_COMENZAR;
    else return EN_PROGRESO;
}

function setTimestamp(hoursBegin, minutesBegin) {
    if (hoursBegin === null || minutesBegin === null) return null;

    let minutes = minutesBegin < 10 ? "0" + minutesBegin : minutesBegin;
    let hours = hoursBegin < 10 ? "0" + hoursBegin : hoursBegin;
    return hours + ":" + minutes;
}

function Row(props) {
    let eventState = getEventState(
        props.eventHoursBegin,
        props.eventMinutesBegin,
        props.eventHoursEnd,
        props.eventMinutesEnd
    );

    let attendance = eventState === EN_PROGRESO ? props.eventAttendance + "%" : "—";

    if (eventState === EN_PROGRESO) attendance = props.eventAttendance + "%";
    else if (props.eventName === null) attendance = "";
    else attendance = "—";

    return (
        <tr className={props.color}>
            <td className="td_begin">{setTimestamp(props.eventHoursBegin, props.eventMinutesBegin)}</td>
            <td className="td_end">{setTimestamp(props.eventHoursEnd, props.eventMinutesEnd)}</td>
            <td className="td_event">{props.eventName}</td>
            <td className="td_host">{props.eventHost}</td>
            <td className="td_room">{props.roomName}</td>
            <td className="td_attendance">{attendance}</td>
            <td className="td_state">{eventState}</td>
            <td className="td_resources">
                <Resources
                    colorIcon={props.color === "color1" ? "whiteIcons" : "blackIcons"}
                    projector={props.hasProjector}
                    sound={props.hasSoundEquipment}
                    disableAccess={props.hasDisabledAccess}
                    wifi={props.hasWifi}
                    ethernet={props.hasEthernet}
                />
            </td>
        </tr>
    );
}

export default Row;
