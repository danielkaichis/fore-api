export type Settings = {
    theme: string;
}

export type Club = {
    brand: string;
    model: string;
    clubType: string;
    flex: string;
    shaft: string;
}

export type Address = {
    streetNumber: number;
    street: string;
    city: string;
    country: string;
}

// export type Hole = {
//     holeNumber: number;
//     par: 3 | 4 | 5;
//     teeLengths: Map<String, number>; // tee -> hole length
//     handicap: number;
// }

// export type CompletedHole = Hole & {
//     score: number;
// }

export type TeeBox = {
    name: string,
    slope: number;
    courseRtg: number;
    length: number;
}

export type Course = {
    name: string;
    teeBoxes: TeeBox[];
    address: Address;
    // scorecard: Hole[]; // array of 18 holes
    // TODO: implement map and courseLayout features
    // map: CourseMap;
    // courseLayout: CourseLayout;
}

export type Game = {
    date: string;
    course: string;
    holes: string; // "9" | "18";
    teeBox: string;
    score: number;
    handicapDifferential: number;
    // scorecard: CompletedHole[];
    includedInHandicap: boolean;
}
