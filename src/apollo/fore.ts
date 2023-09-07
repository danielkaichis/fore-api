import { gql } from "apollo-server-express";
import { db } from "../utils/db";

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
        getClubs: async () => {
            const clubs = await db.collection("clubs").get();
            return clubs.docs.map((club) => club.data());
        }
    },
    Mutation: {
        addClub: async (_: any, { name }: any) => {
            const club = {
                name,
            };
            await db.collection("clubs").add(club);
            return club;
        }
    }
};
