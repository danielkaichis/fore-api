import admin from "firebase-admin";
import { authenticateUserMiddleware } from "./utils/auth";
var serviceAccount = require("../fore-d2820-firebase-adminsdk-gzklu-b305e4fa7c.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

import express, { Request, Response } from "express";
import cors from "cors";
import { CLIENT_ORIGIN_URL, PORT } from "./utils/secrets";
import { ApolloServer } from "apollo-server-express";
import schema from "./apollo/schema";
import { GraphQLError } from "graphql";

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


    const server = new ApolloServer<UserContext>({
        schema,
        context: async ({ req }: { req: Request }) => { 
            try {
                const user = await authenticateUserMiddleware(req.headers.authorization || "");
                return { user };
            } catch (error: any) {
               
                throw new GraphQLError("An error occurred while processing your request. Please try again.", 
                { extensions: 
                    { code: "INTERNAL_SERVER_ERROR" }
                });
            }
        }
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
