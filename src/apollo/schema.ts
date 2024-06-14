import { gql } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { merge } from "lodash";
import { typeDef as Fore, resolvers as foreResolvers } from "./fore";
import { typeDef as Club, resolvers as clubResolvers } from "./club";
import { typeDef as Game, resolvers as gameResolvers } from "./game";
import { typeDef as Course, resolvers as courseResolvers } from "./course";

const typeDefs = gql`
    type Query
    type Mutation
`;

const resolvers = {};

const schema = makeExecutableSchema({
    typeDefs: [typeDefs, Fore, Club, Game, Course],
    resolvers: merge(resolvers, foreResolvers, clubResolvers, gameResolvers, courseResolvers),
  });
  
export default schema;