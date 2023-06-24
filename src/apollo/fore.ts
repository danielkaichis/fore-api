import { gql } from "apollo-server-express";
import { NoteColors, NoteRequestDTO, NoteResponseDTO } from "../types/fore";
import { TodoStatuses, TodoRequestDTO, TodoResponseDTO } from "../types/fore";
import { db } from "../utils/db";

export const typeDef = gql`

    enum NoteColors {
        RED
        BLUE
        GREEN
        YELLOW
        PURPLE
    }

    enum TodoStatuses {
        BACKLOG
        IN_PROGRESS
        COMPLETE
    }

    input NoteRequestDTO {
        userID: String!
        color: NoteColors!
        content: String!
    }

    type NoteResponseDTO {
        color: NoteColors
        content: String
    }

    input TodoRequestDTO {
        userID: String!
        description: String!
        status: TodoStatuses!
    }

    type TodoResponseDTO {
        description: String
        status: TodoStatuses
    }

    extend type Query {
        getNotes(userID: String!): [NoteResponseDTO]
        getTodos(userID: String!): [TodoResponseDTO]
    }

    extend type Mutation {
        createNote(note: NoteRequestDTO!): NoteResponseDTO
        createTodo(todo: TodoRequestDTO!): TodoResponseDTO
    }
`;

export const resolvers = {
    Query: {
        getNotes: async (
            _: any,
            { userID }: { userID: string },
        ): Promise<Array<NoteResponseDTO>> => {
            // search for notes by username in db
            const notes: Array<NoteResponseDTO> = [];
            const userNotesRef = db.collection("users").doc(userID).collection("notes");
            await userNotesRef.get().then(snapshot => {
                    snapshot.docs.forEach(doc => {
                        notes.push({ color: doc.id as NoteColors, content: doc.data().note,});
                    });
                }
            );
            return notes;
        }, 
        getTodos: async (
            _: any,
            { userID }: { userID: string },
        ): Promise<Array<TodoResponseDTO>> => {
            // search for todos by username in db
            const todos: Array<TodoResponseDTO> = [];
            const userTodosRef = db.collection("users").doc(userID).collection("todos");
            await userTodosRef.get().then(snapshot => {
                    snapshot.docs.forEach(doc => {
                        todos.push({ description: doc.id, status: doc.data().status as TodoStatuses });
                    });
                }
            );
            return todos;
        }
    },
    Mutation: {
        createNote: async (
            _: any,
            { note }: { note: NoteRequestDTO },
        ): Promise<NoteResponseDTO> => {
            // create note in firestore
            const userRef = db.collection("users").doc(note.userID).collection("notes").doc(note.color);
            await userRef.set({note: note.content});
            return { color: note.color, content: note.content };
        }, 
        createTodo: async (
            _: any,
            { todo }: { todo: TodoRequestDTO },
        ): Promise<TodoResponseDTO> => {
            // create todo in firestore
            const userRef = db.collection("users").doc(todo.userID).collection("todos").doc(todo.description);
            await userRef.set({status: todo.status });
            return { description: todo.description, status: todo.status };
        }
    }
};
