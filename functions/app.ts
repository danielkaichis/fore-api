import admin from "firebase-admin";
import { authenticateUserMiddleware } from "./utils/auth";
var serviceAccount = require("../fore-d2820-firebase-adminsdk-gzklu-b305e4fa7c.json");
const functions = require("firebase-functions");

// initialize firebase admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

import express, { Request } from "express";
import cors from "cors";
import { CLIENT_ORIGIN_URL } from "./utils/secrets";
const { ApolloServer } = require("apollo-server-cloud-functions");
import schema from "./graphql/schema";
import { GraphQLError } from "graphql";

const startServer = async () => {
    const app: any = express();

    const corsOptions = {
        origin: [CLIENT_ORIGIN_URL, "https://studio.apollographql.com", "http://localhost:3002"],
        credentials: true,
    };
    app.use(cors(corsOptions));

    const server = new ApolloServer({
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

    exports.graphql = functions.https.onRequest(server.createHandler());
};

startServer();
