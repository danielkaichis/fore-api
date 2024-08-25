import { gql } from "apollo-server-express";
import { db } from "../utils/db";
import { Club } from "../types/fore";

export const typeDef = gql`

    input ClubInput {
        brand: String!
        model: String!
        clubType: String!
        flex: String!
        shaft: String!
    }

    type ClubResponse {
        brand: String!
        model: String!
        clubType: String!
        flex: String!
        shaft: String!
    }

    extend type Query {
        getClubs(userID: String!): [ClubResponse]
    }

    extend type Mutation {
        addClub(userID: String!, club: ClubInput!): ClubResponse
    }
`;

export const resolvers = {
    // update with real code
    Query: {
        getClubs: async (
            _: any,
            { userID }: { userID: string },
        ):Promise<Array<Club>> => {
            const clubs: Array<Club> = [];
            const userClubsRef = db.collection("users").doc(userID).collection("clubs");
            await userClubsRef.get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                    clubs.push(doc.data() as Club);
                });
            });
            return clubs;
        }
    },
    Mutation: {
        addClub: async (
            _: any,
            { userID, club }: { userID: string, club: Club }
        ): Promise<Club | Error> => {
            const clubRef = db.collection("users").doc(userID).collection("clubs").doc(club.clubType); 
            // add club if clubRef does not exist
            const clubSnapshot = await clubRef.get();
            if (!clubSnapshot.exists) {
                await clubRef.set(club, { merge: true }).catch((err) => {
                    return new Error("Error adding club");
                });
                return club;
            } else {
                return new Error("Club already exists");
            }
        }
    }
};
