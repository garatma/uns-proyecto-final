import React from "react";
import Table from "./shared/Table";

//This component shows the current announcements through the Table component (See Table.js)
class ReadAnnouncement extends React.Component {
    // Render the announcements table with the "read" mode.
    render() {
        return (
            <div>
                <Table action="read" />
            </div>
        );
    }
}

export default ReadAnnouncement;
