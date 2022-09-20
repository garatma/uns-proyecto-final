import React from "react";
import Table from "./shared/Table";

//This component shows the current announcements throught the Table component (See Table.js)
class ReadAnnouncement extends React.Component {
    render() {
        return (
            <div>
                <Table action="read" />
            </div>
        );
    }
}

export default ReadAnnouncement;
