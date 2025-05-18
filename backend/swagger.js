import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger options
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "CloseMatch Application",
            version: "1.0.0",
            description: "This is a backend api application for CloseMatch Application",
        },
        servers: [
            {
                url: "https://closematch-backend.onrender.com",
                description: "Development server",
            },
        ],
    },
    apis: ["./routers/*.js", "./routes/*.js", "./swagger/*.js"] // Path to the API routes
};

// Generate Swagger specs
const specs = swaggerJsdoc(options);

export default (app) => {
    // Serve Swagger UI
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};