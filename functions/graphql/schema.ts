import { gql } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { IResolvers } from "@graphql-tools/utils";
import deepmerge from "deepmerge";
import { typeDef as Fore, resolvers as foreResolvers } from "./fore.js";
import { typeDef as Club, resolvers as clubResolvers } from "./club.js";
import { typeDef as Game, resolvers as gameResolvers } from "./game.js";
import { typeDef as Course, resolvers as courseResolvers } from "./course.js";

const typeDefs = gql`
    type Query
    type Mutation
`;

const resolvers = {};

const mergedResolvers = deepmerge.all([
  resolvers,
  foreResolvers,
  clubResolvers,
  gameResolvers,
  courseResolvers,
]) as IResolvers;

const schema = makeExecutableSchema({
  typeDefs: [typeDefs, Fore, Club, Game, Course],
  resolvers: mergedResolvers,
});

export default schema;
