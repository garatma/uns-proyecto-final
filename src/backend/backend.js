const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
var sqlite3 = require("sqlite3").verbose();

// ---------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- frontend routes --------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

app.use(cors());
app.use(express.json());
app.use("/admin", express.static(path.join(__dirname, "../admin/build")));
app.use("/visualization", express.static(path.join(__dirname, "../visualization/build")));
app.use("/", express.static(path.join(__dirname, "../visualization/build")));
app.use("/admin/*", express.static(path.join(__dirname, "../admin/build")));
app.use("/visualization/*", express.static(path.join(__dirname, "../visualization/build")));

// replace next endpoint with actual backend code

// ---------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------ database endpoints -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

// ------------------------------------------------ database connection ------------------------------------------------

var db = new sqlite3.Database("../../db/dcic-schedule.db");
db.serialize();

// ---------------------------------------------------- room-event -----------------------------------------------------

app.get("/backend/room-event", (req, res) => {
    console.log("GET to " + req.url);
    db.all("select * from event_room", [], (err, rows) => {
        if (err) res.status(400).json({ error: err.message });
        else res.status(200).json(rows);
    });
});

// --------------------------------------------------- announcement ----------------------------------------------------

app.get("/backend/announcement", (req, res) => {
    console.log("GET to " + req.url);
    db.all("select * from announcement", [], (err, rows) => {
        if (err) res.status(400).json({ error: err.message });
        else res.status(200).json(rows);
    });
});

app.get("/backend/announcement/:id", (req, res) => {
    console.log("GET to " + req.url);
    db.get("select * from announcement where id=" + req.params.id, [], (err, rows) => {
        if (err) res.status(400).json({ error: err.message });
        else res.status(200).json(rows);
    });
});

app.post("/backend/announcement", (req, res) => {
    console.log("POST to " + req.url);
    db.run(
        "insert into announcement (title,message,writer,priority,timestamp_begin,timestamp_end,timestamp_create,timestamp_update) values ($title,$message,$writer,$priority,$timestamp_begin,$timestamp_end,$timestamp_create,$timestamp_update)",
        {
            $title: req.body.title,
            $message: req.body.message,
            $writer: req.body.writer,
            $priority: req.body.priority,
            $timestamp_begin: req.body.timestamp_begin,
            $timestamp_end: req.body.timestamp_end,
            $timestamp_create: req.body.timestamp_create,
            $timestamp_update: req.body.timestamp_update
        },
        (err) => {
            if (err) res.status(400).json({ error: err.message });
            else res.status(200).json({ result: "created!" });
        }
    );
});

app.put("/backend/announcement", (req, res) => {
    console.log("PUT to " + req.url);
    db.run(
        "update announcement set title=$title, message=$message, writer=$writer,priority=$priority,timestamp_begin=$timestamp_begin,timestamp_end=$timestamp_end,timestamp_create=$timestamp_create,timestamp_update=$timestamp_update where id=$id",
        {
            $id: req.body.id,
            $title: req.body.title,
            $message: req.body.message,
            $writer: req.body.writer,
            $priority: req.body.priority,
            $timestamp_begin: req.body.timestamp_begin,
            $timestamp_end: req.body.timestamp_end,
            $timestamp_create: req.body.timestamp_create,
            $timestamp_update: req.body.timestamp_update
        },
        (err) => {
            if (err) res.status(400).json({ error: err.message });
            else res.status(200).json({ result: "updated!" });
        }
    );
});

app.delete("/backend/announcement/:id", (req, res) => {
    console.log("DELETE to " + req.url);
    db.run("delete from announcement where id=" + req.params.id, [], (err) => {
        if (err) res.status(400).json({ error: err.message });
        else res.status(200).json({ result: "deleted!" });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- the rest ------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

// map all other endpoints to visualization

app.use("*", express.static(path.join(__dirname, "../visualization/build")));

// start listening

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App listening on http://127.0.0.1:${PORT}`);
    console.log("Press Ctrl+C to quit.");
});
