export type Club = {
    brand: string;
    model: string;
    clubType: string;
    flex: string;
    shaft: string;
}

export type Hole = {
    holeNumber: number;
    par: number;
    length: number[];
    handicap: number;
}

export type CompletedHole = Hole & {
    score: number;
}

export type Game = {
    date: Date;
    // change to { name: string, length: number, courseRating: number, slope: number } once connected to db
    course: string[];
    holes: 9 | 18;
    teeBox: string;
    score: number;
    handicapDifferential: number;
    scorecard: CompletedHole[];
}