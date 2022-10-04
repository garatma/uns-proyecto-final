# Backend

This directory holds the source code backend server (or _backend_ for short), that hosts both front-ends and provides them with services for database access.

# Services

To read the documentation for each service the backend provides, run the backend (see [Building and running](#building-and-running)) and go to `/docs`

# Technologies

This is a Node.js application, written with Javascript and Express.js.

# Building and running

## Dependencies

To build and run the _backend_, you need `npm` and `node`.

## Building

To install all the dependencies and build the _backend_, run:

```bash
npm install
npm run build
```

## Running

To run the _backend_, execute the following command:

```bash
npm start
```

The backend will run on the port specified by the environment variable `PORT`, or `5000`, if the former is not defined.