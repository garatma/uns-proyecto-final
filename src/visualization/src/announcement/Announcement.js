import "./Announcement.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Alert from "react-bootstrap/Alert";
import Carousel from "react-bootstrap/Carousel";

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
        fetch("/backend/announcement/")
            .then((response) => response.json())
            .then((json) => this.setState({ announcements: json }))
            .catch((cause) => console.log("no se pudo hacer el request: " + cause));
    }

    setAnnouncements() {
        if (this.state.announcements == null) return null;

        let a = this.state.announcements.map((element) => {
            let now = new Date();
            let begin = new Date(element.timestamp_begin * 1000);
            let end = new Date(element.timestamp_end * 1000);

            if (now < begin || end < now) return null;

            return (
                <Carousel.Item className="carouselItem">
                    <Alert className="alert" variant="success">
                        <Alert.Heading className="heading">{element.title}</Alert.Heading>
                        <p className="message">{element.message}</p>
                        <p className="writer">{element.writer}</p>
                        <img src={element.photo} className="photo" alt="" />
                    </Alert>
                </Carousel.Item>
            );
        });
        return a;
    }

    render() {
        let a = this.setAnnouncements();
        return (
            <Carousel className="carousel" variant="dark" interval={10000} controls={false}>
                {a}
            </Carousel>
        );
    }
}

export default AnnouncementsToShow;
