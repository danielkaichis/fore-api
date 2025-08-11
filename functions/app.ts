import { authenticateUserMiddleware } from "./utils/auth.js";
import functions from "firebase-functions";

import express from "express";
import http from "http";
import cors from "cors";
import { CLIENT_ORIGIN_URL } from "./utils/secrets.js";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import schema from "./graphql/schema.js";
import { GraphQLError } from "graphql";

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

const corsOptions = {
  origin: [CLIENT_ORIGIN_URL, "https://studio.apollographql.com", "http://localhost:3002"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  "/graphql",
  cors<cors.CorsRequest>(corsOptions),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      try {
        const user = await authenticateUserMiddleware(req.headers.authorization || "");
        return { user };
      } catch (error: unknown) {
        throw new GraphQLError("An error occurred while processing your request. Please try again.",
          { extensions:
            { code: "UNAUTHENTICATED" },
          });
      }
    },
  })
);

export const graphql = functions.https.onRequest(app);
