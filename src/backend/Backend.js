const express = require("express");
const cors = require("cors");
const path = require("path");
const backend = express();
const sqlite3 = require("sqlite3").verbose();
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

// ---------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------- setup -------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

// set up rate limiter: maximum of five requests per minute

const limiter = rateLimit({
    windowMs: 60000, // 1 minute
    max: 100 // Limit each IP to 100 requests per `window` (here, per 1 minute)
});

// apply rate limiter to all requests
backend.use(limiter);
backend.use(cors());
backend.use(express.json({ limit: "5mb" }));

// ---------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- frontend routes --------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

backend.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
backend.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
backend.use("/admin", express.static(path.join(__dirname, "../admin/build")));
backend.use("/visualization", express.static(path.join(__dirname, "../visualization/build")));
backend.use("/", express.static(path.join(__dirname, "../visualization/build")));
backend.use("/admin/*", express.static(path.join(__dirname, "../admin/build")));
backend.use("/visualization/*", express.static(path.join(__dirname, "../visualization/build")));

const TIMEZONE_OFFSET = 10800000;

// ---------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------ database endpoints -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

// ------------------------------------------------ database connection ------------------------------------------------

let db = new sqlite3.Database("../../db/db.db");
db.serialize();

// ---------------------------------------------------- room-event -----------------------------------------------------

backend.get("/backend/room-event", (req, res) => {
    // #swagger.tags = ['Events and rooms']

    // #swagger.summary = 'Get the events that are taking place at the specified timestamp and hour range'

    /* #swagger.parameters['timestamp'] = {
        in: 'query',
        description: 'Timestamp where the events take place.',
        required: false,
        type: 'Integer'
    } */

    /* #swagger.parameters['range'] = {
        in: 'query',
        description: 'Hour range around the timestamp where the events take place.',
        required: false,
        type: 'Integer'
    } */

    console.log("GET to " + req.url);

    let timestamp = parseInt(req.query.timestamp);
    let range = parseInt(req.query.range);
    let dayOfWeek;
    let currentTime;
    let rangeBegin;
    let rangeEnd;

    let query = " select * from event_room ";

    if (!isNaN(timestamp) && !isNaN(range)) {
        let timestampAdjusted = new Date(timestamp - TIMEZONE_OFFSET);
        dayOfWeek = timestampAdjusted.getUTCDay();
        let hours = timestampAdjusted.getUTCHours();
        let minutes = timestampAdjusted.getUTCMinutes();

        rangeBegin = hours;
        rangeEnd = rangeBegin + range;

        currentTime = hours * 60 + minutes;

        query +=
            " where event_day_of_week=$dayOfWeek and " +
            " ( " +
            " ( " +
            " (event_hours_begin*60)+event_minutes_begin <= $currentTime and " +
            " $currentTime <= (event_hours_end *60)+event_minutes_end " +
            " ) " +
            " or " +
            " ( " +
            " $rangeBegin <= event_hours_begin and " +
            " event_hours_begin <= $rangeEnd " +
            " ) " +
            " ) ";
    }

    db.all(
        query,
        { $dayOfWeek: dayOfWeek, $currentTime: currentTime, $rangeBegin: rangeBegin, $rangeEnd: rangeEnd },
        (err, rows) => {
            if (err) res.status(500).json({ error: err.message });
            else res.status(200).json(rows);
        }
    );
});

// --------------------------------------------------- announcement ----------------------------------------------------

backend.get("/backend/announcement", (req, res) => {
    // #swagger.tags = ['Announcements']

    // #swagger.summary = 'Get all of the announcements'

    console.log("GET to " + req.url);

    db.all("select * from announcement", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(200).json(rows);
    });
});

backend.get("/backend/announcement/id/:id", (req, res) => {
    // #swagger.tags = ['Announcements']

    // #swagger.summary = 'Get a specific announcement, by the its ID in the database'

    /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'Announcement\'s ID in the database.',
        required: true,
        type: 'Integer'
    } */

    console.log("GET to " + req.url);

    db.get("select * from announcement where id=" + req.params.id, [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(200).json(rows);
    });
});

backend.get("/backend/announcement/timestamp/:timestamp", (req, res) => {
    // #swagger.tags = ['Announcements']

    // #swagger.summary = 'Get a specific announcement, that is active in the specified timestamp'

    /* #swagger.parameters['timestamp'] = {
        in: 'path',
        description: 'Timestamp to filter active announcements at that date and time.',
        required: true,
        type: 'Integer'
    } */

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
    // #swagger.tags = ['Announcements']

    // #swagger.summary = 'Create an announcement'

    /* #swagger.parameters['announcement'] = {
        in: 'body',
        description: 'The data for the new announcement. Every variable shown in the example is required.',
        required: true,
        schema: {
            title: 'My first announcement!',
            message: 'This is the best announcement I wrote yet!',
            writer: 'Me',
            priority: 'NORMAL (or EMERGENCY)',
            photo: 'data:image/png;base64,iVB ... (photo in Base 64)',
            timestamp_begin: 1657572360,
            timestamp_end: 1669388400,
            timestamp_create: 1658189878
        }
    } */

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
                "insert into announcement " +
                    "(title,message,writer,priority,photo,timestamp_begin,timestamp_end,timestamp_create) values " +
                    "($title,$message,$writer,$priority,$photo,$timestamp_begin,$timestamp_end,$timestamp_create)",
                {
                    $title: req.body.title.trim(),
                    $message: req.body.message.trim(),
                    $writer: req.body.writer.trim(),
                    $priority: req.body.priority.trim(),
                    $photo: req.body.photo,
                    $timestamp_begin: req.body.timestamp_begin,
                    $timestamp_end: req.body.timestamp_end,
                    $timestamp_create: req.body.timestamp_create
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
    // #swagger.tags = ['Announcements']

    // #swagger.summary = 'Update an announcement'

    /* #swagger.parameters['announcement'] = {
        in: 'body',
        description: 'The new data for the announcement, as-is (nulls will replace previous non-null values of the announcement). Every variable shown in the example is required.',
        required: true,
        schema: {
            id: 39,
            title: 'My first announcement!',
            message: 'This is an update for my first announcement',
            writer: 'Me, again',
            priority: 'NORMAL (or EMERGENCY)',
            photo: 'data:image/png;base64,iVB ... (photo in Base 64)',
            timestamp_begin: 1657572360,
            timestamp_end: 1669388400,
            timestamp_update: 1658199878
        }
    } */

    console.log("PUT to " + req.url);

    db.run(
        "update announcement set title=$title,message=$message,writer=$writer,priority=$priority,photo=$photo,timestamp_begin=$timestamp_begin,timestamp_end=$timestamp_end,timestamp_update=$timestamp_update where id=$id",
        {
            $id: req.body.id,
            $title: req.body.title.trim(),
            $message: req.body.message.trim(),
            $writer: req.body.writer.trim(),
            $priority: req.body.priority.trim(),
            $photo: req.body.photo,
            $timestamp_begin: req.body.timestamp_begin,
            $timestamp_end: req.body.timestamp_end,
            $timestamp_update: req.body.timestamp_update
        },
        (err) => {
            if (err) res.status(500).json({ error: err.message });
            else res.status(200).json({ result: "updated!" });
        }
    );
});

backend.delete("/backend/announcement", (req, res) => {
    // #swagger.tags = ['Announcements']

    // #swagger.summary = 'Delete announcements'

    /* #swagger.parameters['announcements'] = {
        in: 'body',
        description: 'An array or list of the database IDs of the announcements to delete.',
        required: true,
        type: 'array',
        schema: [20, 71, 15]
    } */

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
