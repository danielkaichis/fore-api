import { gql } from "apollo-server-express";
import { db } from "../utils/db.js";
import { Course } from "../types/fore.js";

export const typeDef = gql`

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
        par: Int!
        teeBoxes: [TeeBoxInput!]!
        city: String!
        country: String!
    }

    type CourseResponse {
        name: String!
        par: Int!
        teeBoxes: [TeeBoxResponse!]!
        city: String!
        country: String!
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
    getCourses: async ():Promise<Array<Course>> => {
      const courses: Array<Course> = [];
      const coursesRef = db.collection("courses");
      await coursesRef.get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          courses.push(doc.data() as Course);
        });
      });
      return courses;
    },
  },
  Mutation: {
    addCourse: async (
      _: never,
      { userID, course }: { userID: string, course: Course }
    ): Promise<Course | Error> => {
      // TODO: Add user handling so only certain users can add courses
      const courseRef = db.collection("courses").doc(course.name);
      // add course if courseref does not exist
      const courseSnapshot = await courseRef.get();
      if (!courseSnapshot.exists) {
        await courseRef.set(course, { merge: true }).catch(() => {
          return new Error("Error adding course");
        });
        return course;
      } else {
        return new Error("Course has already been added");
      }
    },
  },
};
