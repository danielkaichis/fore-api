import { gql } from "apollo-server-express";
import { db } from "../utils/db";
import { Club } from "../types/fore";

export const typeDef = gql`

    input ClubRequestDTO {
        brand: String!
        model: String!
        clubType: String!
        flex: String!
        shaft: String!
    }

    type ClubResponseDTO {
        brand: String!
        model: String!
        clubType: String!
        flex: String!
        shaft: String!
    }


    extend type Query {
        getClubs(userID: String!): [ClubResponseDTO]
    }

    extend type Mutation {
        addClub(userID: String!, club: ClubRequestDTO!): ClubResponseDTO
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
        ) => {
            await db.collection("users").doc(userID).collection("clubs").doc(club.clubType).set(club);
        }
    }
};
