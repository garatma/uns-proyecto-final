import React from "react";
import Resources from "./resources/Resources.js";

import "./Visualization.css";

const timeFormat = {
    hour: "numeric",
    minute: "numeric"
};

function getEventState(timestampEventBegin, timestampEventEnd) {
    let now = new Date();
    if (timestampEventBegin == null || timestampEventEnd == null) return null;
    if (now > timestampEventEnd) return "Finalizado";
    else if (now < timestampEventBegin) return "No Empezó";
    else return "En Progreso";
}

function Row(props) {
    const timestampBegin =
        props.eventTimestampBegin === null ? null : props.eventTimestampBegin.toLocaleTimeString("en-US", timeFormat);

    const timestampEnd =
        props.eventTimestampEnd === null ? null : props.eventTimestampEnd.toLocaleTimeString("en-US", timeFormat);

    const eventState =
        props.timestampEventBegin === null || props.timestampEventEnd === null
            ? null
            : getEventState(props.eventTimestampBegin, props.eventTimestampEnd);

    return (
        <tr className={props.color}>
            <td>{timestampBegin}</td>
            <td className="eventCol">{props.eventName}</td>
            <td>{props.roomName}</td>
            <td>{timestampEnd}</td>
            <td className="hostCol">{props.eventHost}</td>
            <td>{props.eventAttendance}</td>
            <td>{eventState}</td>
            <td>
                <Resources
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
