import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import notesRoute from './routes/notes';
import userRoutes from './routes/users';
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";

const app = express();

//this is just to show the api that being called in the terminal
app.use(morgan("dev"));

app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 60 * 60 * 1000
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    })
}))

app.use("/api/users", userRoutes);
app.use("/api/notes", requiresAuth, notesRoute);

app.use((req, res, next)=>{
    next(createHttpError(404, "Endpoint not found"));
});

//express need to take in very specific argument to recognise it as error handling
//the request argument need to be imported from the express lib
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction)=>{
    console.error(error);
    let errorMessage = 'An unknown error occured';
    let statusCode = 500;
    if(isHttpError(error)){
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error:errorMessage });
});

export default app;