import React from "react";
import Resources from "./resources/Resources.js";

function getEventState(timestampEventBegin, timestampEventEnd) {
    let now = new Date();
    let beginDate = new Date(timestampEventBegin * 1000);
    let endDate = new Date(timestampEventEnd * 1000);
    if (now > endDate) return "Finalizado";
    else if (now < beginDate) return "No Empezó";
    else return "En Progreso";
}

function Row(props) {
    let timeBlock =
        props.drawTimeBlock === true ? (
            <td className="TimeBlock" rowSpan={props.eventsPerTimeBlock}>
                {props.timeBlock}
            </td>
        ) : null;

    return (
        <tr>
            {timeBlock}
            <td>{props.eventName}</td>
            <td>{props.roomName}</td>
            <td>{props.eventTimestampBegin}</td>
            <td>{props.eventTimestampEnd}</td>
            <td>{props.eventHost}</td>
            <td>{props.eventAttendance}</td>
            <td>{getEventState(props.eventTimestampBegin, props.eventTimestampEnd)}</td>
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
