const express = require("express");
const path = require("path");
const backend = express();
const cors = require("cors");
var sqlite3 = require("sqlite3").verbose();

// ---------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- frontend routes --------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

backend.use(cors());
backend.use(express.json({ limit: "5mb" }));
backend.use("/admin", express.static(path.join(__dirname, "../admin/build")));
backend.use("/visualization", express.static(path.join(__dirname, "../visualization/build")));
backend.use("/", express.static(path.join(__dirname, "../visualization/build")));
backend.use("/admin/*", express.static(path.join(__dirname, "../admin/build")));
backend.use("/visualization/*", express.static(path.join(__dirname, "../visualization/build")));

// replace next endpoint with actual backend code

// ---------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------ database endpoints -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

// ------------------------------------------------ database connection ------------------------------------------------

var db = new sqlite3.Database("../../db/dcic-schedule.db");
db.serialize();

// ---------------------------------------------------- room-event -----------------------------------------------------

backend.get("/backend/room-event", (req, res) => {
    console.log("GET to " + req.url);

    let query = "select * from event_room";

    let dayOfWeek = req.query.day_of_week;
    let hours = req.query.hours;
    let range = req.query.range;

    if (range !== undefined) {
        if (dayOfWeek === undefined) {
            res.status(400).send("day of week missing.");
            return;
        }

        if (hours === undefined) {
            res.status(400).send("current hours missing.");
            return;
        }

        if (isNaN(parseInt(range)) || isNaN(parseInt(dayOfWeek)) || isNaN(parseInt(hours))) {
            res.status(400).send("parameters must be integers.");
            return;
        }

        let hoursBegin = parseInt(hours) - parseInt(range);
        let hoursEnd = parseInt(hours) + parseInt(range);

        query +=
            " where event_day_of_week=" +
            dayOfWeek +
            " and (event_hours_begin<" +
            hoursEnd +
            " and " +
            hoursBegin +
            "<event_hours_end)";
    }

    console.log(query);

    db.all(query, [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(200).json(rows);
    });
});

// --------------------------------------------------- announcement ----------------------------------------------------

backend.get("/backend/announcement", (req, res) => {
    console.log("GET to " + req.url);
    db.all("select * from announcement", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(200).json(rows);
    });
});

backend.get("/backend/announcement/id/:id", (req, res) => {
    console.log("GET to " + req.url);
    db.get("select * from announcement where id=" + req.params.id, [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(200).json(rows);
    });
});

backend.get("/backend/announcement/timestamp/:timestamp", (req, res) => {
    console.log("GET to " + req.url);

    let timestamp = parseInt(req.params.timestamp);

    let queryEmergency =
        "select * from announcement where timestamp_begin <= $timestamp and $timestamp <= timestamp_end and " +
        "priority='EMERGENCY'";

    let queryNormal =
        "select * from announcement where timestamp_begin <= $timestamp and $timestamp <= timestamp_end and " +
        "priority='NORMAL'";

    db.all(queryEmergency, { $timestamp: timestamp }, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (rows.length == 1) {
            // if there's only one emergency announcement, we return it
            res.status(200).json(rows);
            return;
        } else if (rows.length != 0) {
            // this should never happen
            res.status(500).json({ error: "there's more than one emergency announcement active at that moment" });
        }

        // if there's no emergency announcement, we return all current normal announcements

        db.all(queryNormal, { $timestamp: timestamp }, (err, rows) => {
            if (err) res.status(500).json({ error: err.message });
            else res.status(200).json(rows);
        });
    });
});

backend.post("/backend/announcement", (req, res) => {
    console.log("POST to " + req.url);

    let query =
        "select * from announcement where (timestamp_begin<=$timestamp_end and $timestamp_begin<=timestamp_end) and " +
        "priority='EMERGENCY'";

    db.all(
        query,
        { $timestamp_begin: req.body.timestamp_begin, $timestamp_end: req.body.timestamp_end },
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            if (rows.length != 0 && req.body.priority.trim() === "EMERGENCY") {
                res.status(409).json({ error: "there's already an EMERGENCY announcement in that time period." });
                return;
            }

            db.run(
                "insert into announcement (title,message,writer,priority,photo,timestamp_begin,timestamp_end,timestamp_create,timestamp_update) values ($title,$message,$writer,$priority,$photo,$timestamp_begin,$timestamp_end,$timestamp_create,$timestamp_update)",
                {
                    $title: req.body.title.trim(),
                    $message: req.body.message.trim(),
                    $writer: req.body.writer.trim(),
                    $priority: req.body.priority.trim(),
                    $photo: req.body.photo,
                    $timestamp_begin: req.body.timestamp_begin,
                    $timestamp_end: req.body.timestamp_end,
                    $timestamp_create: req.body.timestamp_create,
                    $timestamp_update: req.body.timestamp_update
                },
                (err) => {
                    if (err) res.status(500).json({ error: err.message });
                    else res.status(200).json({ result: "created!" });
                }
            );
        }
    );
});

backend.put("/backend/announcement", (req, res) => {
    console.log("PUT to " + req.url);
    db.run(
        "update announcement set title=$title,message=$message,writer=$writer,priority=$priority,photo=$photo,timestamp_begin=$timestamp_begin,timestamp_end=$timestamp_end,timestamp_create=$timestamp_create,timestamp_update=$timestamp_update where id=$id",
        {
            $id: req.body.id,
            $title: req.body.title.trim(),
            $message: req.body.message.trim(),
            $writer: req.body.writer.trim(),
            $priority: req.body.priority.trim(),
            $photo: req.body.photo,
            $timestamp_begin: req.body.timestamp_begin,
            $timestamp_end: req.body.timestamp_end,
            $timestamp_create: req.body.timestamp_create,
            $timestamp_update: req.body.timestamp_update
        },
        (err) => {
            if (err) res.status(500).json({ error: err.message });
            else res.status(200).json({ result: "updated!" });
        }
    );
});

backend.delete("/backend/announcement/", (req, res) => {
    console.log("DELETE to " + req.url);
    db.run(
        "delete from announcement where id in (" + JSON.stringify(req.body).replace("[", "").replace("]", "") + ")",
        (err) => {
            if (err) res.status(500).json({ error: err.message });
            else res.status(200).json({ result: "deleted!" });
        }
    );
});

// ---------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- the rest ------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

// map all other endpoints to visualization

backend.use("*", express.static(path.join(__dirname, "../visualization/build")));

// start listening

const port = process.env.PORT || 5000;
backend.listen(port, () => {
    console.log("Backend listening on port " + port);
    console.log("Press Ctrl+C to quit.");
});
