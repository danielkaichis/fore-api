import admin from "firebase-admin";
import { authenticateUserMiddleware } from "./utils/auth";
var serviceAccount = require("../fore-d2820-firebase-adminsdk-gzklu-b305e4fa7c.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { CLIENT_ORIGIN_URL, PORT } from "./utils/secrets";
import { ApolloServer } from "apollo-server-express";
import schema from "./apollo/schema";
import { getAuth } from "firebase/auth";

interface UserContext {
    userID: string;
}

const startServer = async () => {

    // initialize firebase
    const app = express();

    //enable cors
    const corsOptions = {
        origin: [CLIENT_ORIGIN_URL, "https://studio.apollographql.com"],
        credentials: true,
    };
    app.use(cors(corsOptions));

    // TODO: This doesnt work
    // Authenticate user token
    // app.use(authenticateUserMiddleware);

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err.name === "UnauthorizedError") {
          next();
        }
    });

    const server = new ApolloServer<UserContext>({
        schema,
    });

    await server.start();
    server.applyMiddleware({ app });

    app.get("*", (req: Request, res: Response) => {
        res.status(404).send("404 Not Found");
    });

    app.listen(PORT, () => {
        console.log(`> API running at http"//localhost:${PORT}`);
    });
};

startServer();