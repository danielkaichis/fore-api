import { gql } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { merge } from "lodash";
import {
    typeDef as DevDash,
    resolvers as devDashResolvers,
} from "./devDash";
import { GraphQLScalarType } from "graphql";

const typeDefs = gql`
    type Query
    type Mutation
`;

const resolvers = {};

const schema = makeExecutableSchema({
    typeDefs: [typeDefs, DevDash],
    resolvers: merge(resolvers, devDashResolvers),
  });
  
export default schema;