import express from "express";
// import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import http from "node:http";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

import "dotenv/config";
import { connectDB } from "./config/db.js";
import { authenticate } from "./middlewares/authenticate.js";
import { RequestBodyValidator } from "./middlewares/validator.js";
import { redisClient } from "./config/redis.js";
import { setupWebsocket } from "./websocket/setupWebsocket.js";
import cookieParser from "cookie-parser";
import swaggerSetup from "./swagger.js";



//External routes
import { notificationRouter } from "./routers/notification_router.js";
import { messagingRouter } from "./routers/messaging_router.js";
import { reportRouter } from "./routers/report_router.js";
import { authenticationRouter } from "./routers/auth_router.js";
import { userRouter } from "./routers/user_router.js";
import { adminRouter } from "./routers/admin_router.js";
import { ticketRouter } from "./routers/ticket_router.js";



//Websocket routes
import { messagingSocket } from "./websocket/messaging.js";
import { notificationSocket } from "./websocket/notification.js";

//Event emiitters
import { eventEmitter } from "./utils/eventEmitter.js";


// import swaggerRun from "./config/swagger";



dotenv.config();

connectDB();

const app = express();
const PORT = 5000;
const dbUri = process.env.MONGODB_URI;



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.disable('x-powered-by');

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(authenticate);
app.use(RequestBodyValidator);
app.use(express.static(__dirname + 'public'));
app.use('/socket.io-client', express.static('node_modules/socket.io-client/dist'));


//Starting the http and websocket server
export const httpserver = http.createServer(app);
httpserver.on('listening', () => {
  
//Starting up the redis
redisClient.connect();

//Starting up the database
connectDB();

//Starting up the websocket
const socket = setupWebsocket(httpserver);

// socket.on('connection', () => {
//     console.log('Success');

// })

// socket.on('error', (e) => {
//     console.log(`Error: ${e}`);
// })

})



app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; connect-src 'self' http://localhost:5000;"
    );
    next();
});

//Setting up external routes
swaggerSetup(app);

app.use("/auth", authenticationRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use('/report', reportRouter);
app.use('/messages', messagingRouter);
app.use('/ticket', ticketRouter);
app.use('/notification', notificationRouter);


app.get('/', function (req, res) {
    res.send("Hello World!")
})

httpserver.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log("Server is listening on PORT", PORT);
});

