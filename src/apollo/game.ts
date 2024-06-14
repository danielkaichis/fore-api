import { gql } from "apollo-server-express";
import { db } from "../utils/db";
import { Game } from "../types/fore";
import {  } from "@graphql-tools/schema"

export const typeDef = gql`

    input CompletedHoleInput {
        holeNumber: Int!
        par: Int!
        length: [Int]
        handicap: Int!
        score: Int!
    }

    type CompletedHoleResponse {
        holeNumber: Int!
        par: Int!
        length: [Int]
        handicap: Int!
        score: Int!
    }

    input GameInput {
        date: String!
        course: String
        holes: Int!
        teeBox: String!
        score: Int!
        scorecard: [CompletedHoleInput]
    }

    type GameResponse {
        date: String!
        course: String
        holes: Int!
        teeBox: String!
        score: Int!
        handicapDifferential: Float!
        scorecard: [CompletedHoleResponse]
    }

    extend type Query {
        getGames(userID: String!): [GameResponse]
    }

    extend type Mutation {
        addGame(userID: String!, game: GameInput!): GameResponse
    }
`;

export const resolvers = {
    // update with real code
    Query: {
        getGames: async (
            _: any,
            { userID }: { userID: string },
        ):Promise<Array<Game>> => {
            const games: Array<Game> = [];
            const userGamesRef = db.collection("users").doc(userID).collection("games");
            await userGamesRef.get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                    games.push(doc.data() as Game);
                });
            });
            return games;
        }
    },
    Mutation: {
        addGame: async (
            _: any,
            { userID, game }: { userID: string, game: Game }
        ): Promise<Game | Error> => {
            const clubRef = db.collection("users").doc(userID).collection("games").doc(game.date.toUTCString()); 
            // add club if clubRef does not exist
            await clubRef.set(game, { merge: true }).catch(() => {
                return new Error("Error adding game");
            });
            return game;
        }
    }
};
