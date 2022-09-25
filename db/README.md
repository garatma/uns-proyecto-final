# Database

This directory holds everything database related, which is a very small SQLite database with the very few tables the system needs to function.

# Contents

This directory holds the following files:
- **db.db**: the actual SQLite database
- **init.sql**: a init script that creates the tables, views and testing data

# Tables and views

- **room**: every room where events take place
- **event**: every event (class, talk, etc.) took place in a certain room and time range
- **announcement**: every announcement that is active between a certain time range
- **event_room**: convenience view that basically joins room and event tables

# Conventions

Because SQLite is very light-weight, a set of conventions were taken to better organize all the data we need to store and how we store it:
- Timestamps are integers in UNIX time, in seconds
- Booleans are integers that:
  - Use 0 to represent `false`
  - Use any other value (but preferrably 1) to represent `true`
- All names (tables, columns, etc.) are in lowercase, with underscores between the words
- Binary data (such as pictures) are stored in Base64 strings (text)