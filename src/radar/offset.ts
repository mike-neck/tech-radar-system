import {Quadrant} from "./quadrant";
import {leftIsMorePracticalThanRight, previousTechAssessmentOf, TechAssessment} from "./tech-assessment";
import {EntryClassification} from "./entry-classification";

export type Offset = { x: number, y: number };
export const LeftEdge = -675;
const LegendLeftEdge = LeftEdge;
const LegendRightEdge = 450;
const LegendUpperTop = -310;
const LegendLowerTop = 90;
const LegendOffset: Map<Quadrant, Offset> = new Map<Quadrant, Offset>([
    [Quadrant.First, {x: LegendRightEdge, y: LegendUpperTop}],
    [Quadrant.Second, {x: LegendLeftEdge, y: LegendUpperTop}],
    [Quadrant.Third, {x: LegendLeftEdge, y: LegendLowerTop}],
    [Quadrant.Fourth, {x: LegendRightEdge, y: LegendLowerTop}],
]);

export function quadrantLegendOffset(quadrant: Quadrant): Offset {
    const offset = LegendOffset.get(quadrant);
    if (typeof offset === "undefined") {
        throw new Error(`unknown quadrant: ${quadrant}`);
    }
    return offset;
}

type LegendHorizontalOffset = {
    length: number,
};

export function legendHorizontalOffset(assessment: TechAssessment): LegendHorizontalOffset {
    return {
        length: leftIsMorePracticalThanRight(assessment, TechAssessment.Assess) ? 0 : 120
    };
}

export type LegendVerticalOffsetConfig = {
    lengthAt: (index: number) => LegendVerticalOffset,
    title: LegendVerticalOffset,
}

export type LegendVerticalOffset = {
    length: number,
};

export function legendVerticalOffset(entries: EntryClassification<any>): (quadrant: Quadrant, assessment: TechAssessment) => LegendVerticalOffsetConfig {
    return (quadrant: Quadrant, assessment: TechAssessment) => {
        const byTechAssessment = entries.getByQuadrant(quadrant);
        if (assessment === TechAssessment.Trial || assessment === TechAssessment.Hold) {
            const previous = previousTechAssessmentOf(assessment);
            const len = byTechAssessment.getByTechAssessment(previous).length;
            return {
                title: {length: 36 + len * 12 - 16},
                lengthAt: index => ({
                    length: 36 + (len + index) * 12
                })
            };
        } else {
            return {
                title: {length: -16},
                lengthAt: index => ({
                    length: index * 12
                })
            };
        }
    };
}
