import { gql } from "apollo-server-express";
import { db } from "../utils/db";
import { Course } from "../types/fore";

export const typeDef = gql`

    input AddressInput { 
        streetNumber: Int!
        street: String!
        city: String!
        country: String!
    }

    type AddressResponse { 
        streetNumber: Int!
        street: String!
        city: String!
        country: String!
    }

    input TeeLengthMapInput {
        key: String!
        value: Int!
    }

    type TeeLengthMapResponse {
        key: String!
        value: Int!
    }

    input HoleInput { 
        holeNumber: Int!
        par: Int!
        teeLengths: TeeLengthMapInput! 
        handicap: Int!
    }

    type HoleResponse { 
        holeNumber: Int!
        par: Int!
        teeLengths: TeeLengthMapResponse! 
        handicap: Int!
    }

    input TeeBoxInput {
        name: String!
        slope: Int!
        courseRtg: Float!
        length: Int!
    } 

    type TeeBoxResponse {
        name: String!
        slope: Int!
        courseRtg: Float!
        length: Int!
    } 

    input CourseInput {
        name: String!
        teeBoxes: [TeeBoxInput!]!
        address: AddressInput
        scorecard: [HoleInput!]!
    }

    type CourseResponse {
        name: String!
        teeBoxes: [TeeBoxResponse!]!
        address: AddressResponse
        scorecard: [HoleResponse!]!
    }

    extend type Query {
        getCourses(userID: String!): [CourseResponse]
    }

    extend type Mutation {
        addCourse(userID: String!, course: CourseInput!): CourseResponse
    }
`;

export const resolvers = {
    // update with real code
    Query: {
        getCourses: async (
            _: any,
            // TODO: protect this endpoint
            { userID }: { userID: string },
        ):Promise<Array<Course>> => {
            const courses: Array<Course> = [];
            const coursesRef = db.collection("courses");
            await coursesRef.get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                    courses.push(doc.data() as Course);
                });
            });
            return courses;
        }
    },
    Mutation: {
        addCourse: async (
            _: any,
            { userID, course }: { userID: string, course: Course }
        ): Promise<Course | Error> => {
            const courseRef = db.collection("courses").doc(course.name);
            // add course if courseref does not exist
            const courseSnapshot = await courseRef.get();
            if (!courseSnapshot.exists) {
                await courseRef.set(course, { merge: true }).catch((err) => {
                    return new Error("Error adding course");
                });
                return course;
            } else {
                return new Error("Course has already been added");
            }
        }
    }
};
