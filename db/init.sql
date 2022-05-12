CREATE TABLE room (
    id INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL,
    number_of_chairs INTEGER CHECK(number_of_chairs>=0),
    has_projector INTEGER CHECK(has_projector==0 or has_projector==1),
    has_sound_equipment INTEGER CHECK(has_sound_equipment==0 or has_sound_equipment==1),
    has_disabled_access INTEGER CHECK(has_disabled_access==0 or has_disabled_access==1),
    has_wifi INTEGER CHECK(has_wifi==0 or has_wifi==1),
    has_ethernet INTEGER CHECK(has_ethernet==0 or has_ethernet==1),
    PRIMARY KEY(id AUTOINCREMENT)
);

INSERT INTO room (id,name,number_of_chairs,has_projector,has_sound_equipment,has_disabled_access,has_wifi,has_ethernet) VALUES
    (1,"espacio 1",10,1,0,1,0,1),
    (2,"espacio 2",10,0,1,0,1,0),
    (3,"espacio 3",10,1,1,0,1,1),
    (4,"espacio 4",10,0,0,1,0,0);

CREATE TABLE event (
    id INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    host TEXT NOT NULL,
    attendance INTEGER NOT NULL CHECK(0 <= attendance AND attendance <= 100),
    room_id INTEGER NOT NULL UNIQUE,
    timestamp_begin INTEGER NOT NULL CHECK(timestamp_begin >= 0),
    timestamp_end INTEGER NOT NULL CHECK(timestamp_end >= 0),
    repeat INTEGER,
    timestamp_repeat_begin INTEGER CHECK(timestamp_repeat_begin >= 0),
    timestamp_repeat_end INTEGER CHECK(timestamp_repeat_end >= 0),
    FOREIGN KEY(room_id) REFERENCES room(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY(id AUTOINCREMENT)
);

INSERT INTO event (id,name,host,attendance,room_id,timestamp_begin,timestamp_end) VALUES
    (1,"evento 1","host 1", 0,1,1652007600,1652011200),
    (2,"evento 2","host 2",25,2,1652007600,1652014800),
    (3,"evento 3","host 3",50,3,1652014800,1652022000),
    (4,"evento 4","host 4",75,4,1652018400,1652022000);

CREATE VIEW event_room AS
    SELECT
        e.id AS event_id,
        e.name AS event_name,
        e.description AS event_description,
        e.host AS event_host,
        e.attendance AS event_attendance,
        e.timestamp_begin AS event_timestamp_begin,
        e.timestamp_end AS event_timestamp_end,
        e.repeat AS event_repeat,
        e.timestamp_repeat_begin AS event_timestamp_repeat_begin,
        e.timestamp_repeat_end AS event_timestamp_repeat_end,
        r.id AS room_id,
        r.name AS room_name,
        r.number_of_chairs AS room_number_of_chairs,
        r.has_projector AS room_has_projector,
        r.has_sound_equipment AS room_has_sound_equipment,
        r.has_disabled_access AS room_has_disabled_access,
        r.has_wifi AS room_has_wifi,
        r.has_ethernet AS room_has_ethernet
    FROM EVENT e
    INNER JOIN room r ON e.room_id = r.id;