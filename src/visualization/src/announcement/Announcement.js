import "./Announcement.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Alert from "react-bootstrap/Alert";
import Carousel from "react-bootstrap/Carousel";
import emergencyIcon from "./icons/siren.png";
import informationIcon from "./icons/information.png";
//Emergency Icon: <a href="https://www.flaticon.com/free-icons/alert" title="alert icons">Alert icons created by Freepik - Flaticon</a>
//Information Icon: <a href="https://www.flaticon.com/free-icons/info" title="info icons">Info icons created by Freepik - Flaticon</a>

class AnnouncementsToShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            announcements: null
        };
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 180000);
        this.tick();
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        fetch("/backend/announcement/timestamp/" + Math.floor(Date.now() / 1000))
            .then((response) => response.json())
            .then((json) => this.setState({ announcements: json }))
            .catch((cause) => console.log("no se pudo hacer el request: " + cause));
    }

    printAnnouncement(element, priority, icon) {
        return <Carousel.Item key={element.id} className="carouselItem">
            <Alert className={priority} >
                <Alert.Heading className={priority + "Heading"}>{element.title}</Alert.Heading>
                <div className=""><img src={icon} className="announcementIcon" alt="icon" /></div>
                <p className={priority + "Message"}>{element.message}</p>
                <p className={priority + "Writer"}>{element.writer}</p>
                <img src={element.photo} className="photo" alt="" />
            </Alert>
        </Carousel.Item>

    }

    setAnnouncements() {
        if (this.state.announcements == null) return null;

        let announcementsList = [];

        for (let i = 0; i < this.state.announcements.length; i++) {
            const element = this.state.announcements[i];

            if (element.priority === "EMERGENCY") {
                announcementsList.push(this.printAnnouncement(element, element.priority, emergencyIcon));
            }
            else {
                announcementsList.push(this.printAnnouncement(element, element.priority, informationIcon));
            }
        }

        return announcementsList;
    }

    render() {
        let announcements = this.setAnnouncements();
        return (
            <Carousel className="carousel" variant="dark" interval={10000} controls={false}>
                {announcements}
            </Carousel>
        );
    }
}

export default AnnouncementsToShow;
