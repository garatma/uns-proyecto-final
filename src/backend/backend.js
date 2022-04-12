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

app.use(
  "/visualization",
  express.static(path.join(__dirname, "../visualization/build"))
);

app.use("/", express.static(path.join(__dirname, "../visualization/build")));

app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname + "/../admin/build/index.html"));
});

app.get("/visualization/*", (req, res) => {
  res.sendFile(path.join(__dirname + "/../visualization/build/index.html"));
});

// replace next endpoint with actual backend code

// ---------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------ database endpoints -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

// ------------------------------------------------ database connection ------------------------------------------------

var db = new sqlite3.Database("../../db/dcic-schedule.db");
db.serialize();

// ---------------------------------------------------- room-event -----------------------------------------------------

app.get("/backend/room-event", (req, res) => {
  db.all("select * from room_event", [], (err, rows) => {
    if (err) res.status(400).json({ error: err.message });
    else res.status(200).json(rows);
  });
});

app.get("/backend/room-event/:id", (req, res) => {
  db.get(
    "select * from room_event where id=" + req.params.id,
    [],
    (err, rows) => {
      if (err) res.status(400).json({ error: err.message });
      else res.status(200).json(rows);
    }

  );
});

// --------------------------------------------------- announcement ----------------------------------------------------

app.get("/backend/announcement", (req, res) => {
  db.all("select * from announcement", [], (err, rows) => {
    if (err) res.status(400).json({ error: err.message });
    else res.status(200).json(rows);
  });
});

app.get("/backend/announcement/:id", (req, res) => {
  db.get(
    "select * from announcement where id=" + req.params.id,
    [],
    (err, rows) => {
      if (err) res.status(400).json({ error: err.message });
      else res.status(200).json(rows);
    }
  );
});

app.post("/backend/announcement", (req, res) => {
  db.run(
    "insert into announcement (message,writer,priority,timestamp_begin,timestamp_end,timestamp_create,timestamp_update) values ($message,$writer,$priority,$timestamp_begin,$timestamp_end,$timestamp_create,$timestamp_update)",
    {
      $message: req.body.message,
      $writer: req.body.writer,
      $priority: req.body.priority,
      $timestamp_begin: req.body.timestamp_begin,
      $timestamp_end: req.body.timestamp_end,
      $timestamp_create: req.body.timestamp_create,
      $timestamp_update: req.body.timestamp_update,
    },
    (err) => {
      if (err) res.status(400).json({ error: err.message });
      else res.status(200).json({ result: "created!" });
    }
  );
});

app.put("/backend/announcement", (req, res) => {
  db.run(
    "update announcement set message=$message, writer=$writer,priority=$priority,timestamp_begin=$timestamp_begin,timestamp_end=$timestamp_end,timestamp_create=$timestamp_create,timestamp_update=$timestamp_update where id=$id",
    {
      $id: req.body.id,
      $message: req.body.message,
      $writer: req.body.writer,
      $priority: req.body.priority,
      $timestamp_begin: req.body.timestamp_begin,
      $timestamp_end: req.body.timestamp_end,
      $timestamp_create: req.body.timestamp_create,
      $timestamp_update: req.body.timestamp_update,
    },
    (err) => {
      if (err) res.status(400).json({ error: err.message });
      else res.status(200).json({ result: "updated!" });
    }
  );
});

app.delete("/backend/announcement/:id", (req, res) => {
  db.run("delete from announcement where id=" + req.params.id, [], (err) => {
    if (err) res.status(400).json({ error: err.message });
    else res.status(200).json({ result: "deleted!" });
  });
});

// ---------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- the rest ------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

// map all other endpoints to visualization

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/../visualization/build/index.html"));
});

// start listening

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on http://127.0.0.1:${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
