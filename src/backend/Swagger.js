const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./Backend.js"];

const port = process.env.PORT || 5000;
const host = process.env.PROJECT_DOMAIN ? process.env.PROJECT_DOMAIN + ".glitch.me" : "localhost:" + port;

const doc = {
    info: {
        version: "1.1.0",
        title: "Proyecto Final Backend API"
    },
    host: host,
    tags: [
        {
            name: "Events and rooms",
            description: "Every service related with events and rooms."
        },
        {
            name: "Announcements",
            description: "Every service related with announcements."
        }
    ]
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require("./Backend.js");
});
