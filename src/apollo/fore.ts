import { gql } from "apollo-server-express";
import { db } from "../utils/db";
import { ClubRequestDTO, ClubResponseDTO } from "../types/fore";

export const typeDef = gql`

    input ClubRequestDTO {
        userID: String!
        brand: String!
        model: String!
        clubType: String!
        flex: String
        shaft: String
    }

    type ClubResponseDTO {
        brand: String!
        model: String!
        clubType: String!
        flex: String
        shaft: String
    }

    extend type Query {
        getClubs(userID: String!): [ClubResponseDTO]
    }

    extend type Mutation {
        addClub(club: ClubRequestDTO!): ClubResponseDTO
    }
`;

export const resolvers = {
    // update with real code
    Query: {
        getClubs: async (
            _: any,
            { userID }: { userID: string },
        ):Promise<Array<ClubResponseDTO>> => {
            const clubs: Array<ClubResponseDTO> = [];
            const userClubsRef = db.collection("users").doc(userID).collection("clubs");
            await userClubsRef.get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                    clubs.push(doc.data() as ClubResponseDTO);
                });
            });
            return clubs;
        }
    },
    Mutation: {
        addClub: async (
            _: any,
            userID: string,
            { club }: { club: ClubRequestDTO }
        ) => {
            const userRef = db.collection("users").doc(userID);
            await userRef.collection("clubs").add(club);
        }
    }
};
