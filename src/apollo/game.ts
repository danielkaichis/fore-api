import { gql } from "apollo-server-express";
import { db } from "../utils/db";
import { Game, TeeBox } from "../types/fore";
import { calculateHandicapDifferential } from "../utils/handicapUtil";


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
        course: String!
        holes: String!
        teeBox: String!
        score: Int!
        scorecard: [CompletedHoleInput]
    }

    type GameResponse {
        date: String!
        course: String!
        holes: String!
        teeBox: String!
        score: Int!
        handicapDifferential: Float
        scorecard: [CompletedHoleResponse]
        includedInHandicap: Boolean
    }

    type GameResponseObject {
        games: [GameResponse]
        handicap: Float
    }

    extend type Query {
        getGames(userID: String!): GameResponseObject
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
        ):Promise<{ games: Array<Game>, handicap: number }> => {
            try {
                const games: Array<Game> = [];
                const userGamesRef = db.collection("users").doc(userID).collection("games");  
                await userGamesRef.get().then(snapshot => {
                    snapshot.docs.forEach(async doc => {
                        games.push(doc.data() as Game);
                    });
                });
                const userRef = db.collection("users").doc(userID);
                const handicap = calculateHandicapDifferential(games)
                await userRef.set({ handicap });
                return {
                    games,
                    handicap
                };
            } catch (error) { 
                throw new Error("Error getting games");
            }
        }
    },
    Mutation: {
        addGame: async (
            _: any,
            { userID, game }: { userID: string, game: Game }
        ): Promise<Game | Error> => {
            const courseRef = db.collection("courses").doc(game.course);   
            await courseRef.get().then(courseDoc => {
                const course = courseDoc.data();
                if (course) {
                    const teeBox = course.teeBoxes.find((teeBox: TeeBox) => teeBox.name === game.teeBox);
                    let slope = teeBox?.slope;
                    let courseRtg = teeBox?.courseRtg;
                    if (game.holes == "9") {
                        game.handicapDifferential = (game.score - (courseRtg / 2)) * (113 / slope);
                    } else {
                        game.handicapDifferential = (game.score - courseRtg) * (113 / slope);
                    }
                }
            });
            const gameRef = db.collection("users").doc(userID).collection("games").doc(new Date(Date.now()).toUTCString()); 
            await gameRef.set(game, { merge: true }).catch(() => {
                return new Error("Error adding game");
            });
            return game;
        }
    }
};
