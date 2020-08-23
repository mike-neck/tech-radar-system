export enum Quadrant {
    First,
    Second,
    Third,
    Fourth,
}

export interface QuadrantAccess<T> {
    getByQuadrant(quadrant: Quadrant): T
}

export function quadrantAsString(quadrant: Quadrant): string {
    switch (quadrant) {
        case Quadrant.First:
            return "First";
        case Quadrant.Second:
            return "Second";
        case Quadrant.Third:
            return "Third";
        case Quadrant.Fourth:
            return "Fourth"
    }
}

export function orderedQuadrants(): [Quadrant, Quadrant, Quadrant, Quadrant] {
    return [
        Quadrant.Second,
        Quadrant.First,
        Quadrant.Third,
        Quadrant.Fourth,
    ];
}
