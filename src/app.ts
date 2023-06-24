import admin from "firebase-admin";
var serviceAccount = require("../fore-d2820-firebase-adminsdk-gzklu-b305e4fa7c.json");

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

import express, { Request, Response } from "express";
import cors from "cors";
import { CLIENT_ORIGIN_URL, PORT } from "./utils/secrets";
import { ApolloServer } from "apollo-server-express";
import schema from "./apollo/schema";

const startServer = async () => {

    // initialize firebase
    const app = express();

    //enable cors
    const corsOptions = {
        origin: [CLIENT_ORIGIN_URL, "https://studio.apollographql.com"],
    };
    app.use(cors(corsOptions));

    const server = new ApolloServer({
        schema,
    });
    await server.start();
    server.applyMiddleware({ app });

    app.get("*", (req: Request, res: Response) => {
        res.status(404).send("404 Not Found");
    });

    app.listen(PORT), () => {
        console.log(`> API running at http"//localhost:${PORT}`);
    };
};

startServer();