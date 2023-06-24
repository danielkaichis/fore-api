import { gql } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { merge } from "lodash";
import {
    typeDef as fore,
    resolvers as foreResolvers,
} from "./fore";
import { GraphQLScalarType } from "graphql";

const typeDefs = gql`
    type Query
    type Mutation
`;

const resolvers = {};

const schema = makeExecutableSchema({
    typeDefs: [typeDefs, fore],
    resolvers: merge(resolvers, foreResolvers),
  });
  
export default schema;