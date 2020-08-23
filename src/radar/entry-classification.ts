import {Quadrant, QuadrantAccess} from "./quadrant";
import {TechAssessment} from "./tech-assessment";

export interface Technology {
    name: string;
    active: boolean;
    assessment: TechAssessment;
    quadrant: Quadrant;
}

export interface TechnologyWithIndex extends Technology {
    index: string;
}

export type ByTechAssessment<T> = {
    adopt: T[];
    trial: T[];
    assess: T[];
    hold: T[];
    getByTechAssessment(techAssessment: TechAssessment): T[];
    map<N>(mapping: (item: T) => N): ByTechAssessment<N>;
    mapAsArray<N>(mapping: (item: T, indexInAssessments: number) => N): N[];
}

class ByTechAssessmentImpl<T> implements ByTechAssessment<T> {
    adopt: T[];
    trial: T[];
    assess: T[];
    hold: T[];

    constructor(adopt: T[], trial: T[], assess: T[], hold: T[]) {
        this.adopt = adopt;
        this.assess = assess;
        this.hold = hold;
        this.trial = trial;
    }

    getByTechAssessment(techAssessment: TechAssessment): T[] {
        switch (techAssessment) {
            case TechAssessment.Adopt: return this.adopt;
            case TechAssessment.Trial: return this.trial;
            case TechAssessment.Assess: return this.assess;
            case TechAssessment.Hold: return this.hold;
        }
    }

    map<N>(mapping: (item: T) => N): ByTechAssessment<N> {
        const ad = this.adopt.map(mapping);
        const tr = this.trial.map(mapping);
        const as = this.assess.map(mapping);
        const ho = this.hold.map(mapping);
        return new ByTechAssessmentImpl(ad, tr, as, ho);
    }

    mapAsArray<N>(mapping: (item: T, indexInAssessments: number) => N): N[] {
        const ad = this.adopt.map(mapping);
        const tr = this.trial.map(mapping);
        const as = this.assess.map(mapping);
        const ho = this.hold.map(mapping);
        return [
            ...ad,
            ...tr,
            ...as,
            ...ho,
        ];
    }
}

function newByTechAssessment(): ByTechAssessment<Technology> {
    return new ByTechAssessmentImpl([], [], [], []);
}

function appendNewEntryToTechAssessment(
    byTechAssessment: ByTechAssessment<Technology>, technology: Technology): ByTechAssessment<Technology> {
    switch (technology.assessment) {
        case TechAssessment.Adopt:
            const adopt = [...byTechAssessment.adopt, technology];
            return new ByTechAssessmentImpl(adopt, byTechAssessment.trial, byTechAssessment.assess, byTechAssessment.hold);
        case TechAssessment.Assess:
            const assess = [...byTechAssessment.assess, technology];
            return new ByTechAssessmentImpl(byTechAssessment.adopt, byTechAssessment.trial, assess, byTechAssessment.hold);
        case TechAssessment.Trial:
            const trial = [...byTechAssessment.trial, technology];
            return new ByTechAssessmentImpl(byTechAssessment.adopt, trial, byTechAssessment.assess, byTechAssessment.hold);
        case TechAssessment.Hold:
            const hold = [...byTechAssessment.hold, technology]
            return new ByTechAssessmentImpl(byTechAssessment.adopt, byTechAssessment.trial, byTechAssessment.assess, hold);
    }
}

function sortAndGiveIndex(previous: number, technologies: Technology[]): [number, TechnologyWithIndex[]] {
    technologies.sort((left, right) => left.name.localeCompare(right.name));
    const index = [previous];
    const withId: TechnologyWithIndex[] = technologies.map(tech => ({
        ...tech, index: `${++index[0]}`
    }) as TechnologyWithIndex);
    return [index[0], withId];
}

function sortByName(
    previous: number, byTechAssessment: ByTechAssessment<Technology>): [number, ByTechAssessment<TechnologyWithIndex>] {
    const [adoptIndex, adopt] = sortAndGiveIndex(previous, byTechAssessment.adopt);
    const [trialIndex, trial] = sortAndGiveIndex(adoptIndex, byTechAssessment.trial);
    const [assessIndex, assess] = sortAndGiveIndex(trialIndex, byTechAssessment.assess);
    const [holdIndex, hold] = sortAndGiveIndex(assessIndex, byTechAssessment.hold);
    return [
        holdIndex,
        new ByTechAssessmentImpl(adopt, trial, assess, hold)
    ];
}

export interface EntryClassification<T> extends QuadrantAccess<ByTechAssessment<T>>{
    first: ByTechAssessment<T>;
    second: ByTechAssessment<T>;
    third: ByTechAssessment<T>;
    fourth: ByTechAssessment<T>;
    forEach(action: (item: ByTechAssessment<T>) => void): void;
    mapEntries<N>(mapping: (item: T) => N): EntryClassification<N>;
    mapAsArray<N>(mapping: (item: T, allIndex: number, indexInQuadrants: number, indexInAssessments: number) => N): N[];
}

class EntryClassificationImpl<T> implements EntryClassification<T> {
    first: ByTechAssessment<T>;
    second: ByTechAssessment<T>;
    third: ByTechAssessment<T>;
    fourth: ByTechAssessment<T>;

    constructor(first: ByTechAssessment<T>, second: ByTechAssessment<T>, third: ByTechAssessment<T>, fourth: ByTechAssessment<T>) {
        this.first = first;
        this.second = second;
        this.third = third;
        this.fourth = fourth;
    }

    getByQuadrant(quadrant: Quadrant): ByTechAssessment<T> {
        switch (quadrant) {
            case Quadrant.First: return this.first;
            case Quadrant.Second: return this.second;
            case Quadrant.Third: return this.third;
            case Quadrant.Fourth: return this.fourth;
        }
    }

    forEach(action: (item: ByTechAssessment<T>) => void): void {
        action(this.second);
        action(this.first);
        action(this.third);
        action(this.fourth);
    }

    mapEntries<N>(mapping: (item: T) => N): EntryClassification<N> {
        const second = this.second.map(mapping);
        const first = this.first.map(mapping);
        const third = this.third.map(mapping);
        const fourth = this.fourth.map(mapping);
        return new EntryClassificationImpl(first, second, third, fourth);
    }

    mapAsArray<N>(mapping: (item: T, allIndex: number, indexInQuadrants: number, indexInAssessments: number) => N): N[] {
        const indices = [0, 0, 0, 0, 0];
        const second = this.second.mapAsArray((item, indexInAssessments) => mapping(item, indices[0]++, indices[2]++, indexInAssessments));
        const first = this.first.mapAsArray((item, indexInAssessments) => mapping(item, indices[0]++, indices[1]++, indexInAssessments));
        const third = this.third.mapAsArray((item, indexInAssessments) => mapping(item, indices[0]++, indices[3]++, indexInAssessments));
        const fourth = this.fourth.mapAsArray((item, indexInAssessments) => mapping(item, indices[0]++, indices[1]++, indexInAssessments));
        return [
            ...second,
            ...first,
            ...third,
            ...fourth,
        ];
    }
}

function newSegmentedEntries(): EntryClassification<Technology> {
    return new EntryClassificationImpl(
        newByTechAssessment(),
        newByTechAssessment(),
        newByTechAssessment(),
        newByTechAssessment()
    );
}

function appendNewEntryToSegmentedEntries(
    segmentedEntries: EntryClassification<Technology>, technology: Technology): EntryClassification<Technology> {
    switch (technology.quadrant) {
        case Quadrant.First:
            return {...segmentedEntries, first: appendNewEntryToTechAssessment(segmentedEntries.first, technology)};
        case Quadrant.Second:
            return {...segmentedEntries, second: appendNewEntryToTechAssessment(segmentedEntries.second, technology)};
        case Quadrant.Third:
            return {...segmentedEntries, third: appendNewEntryToTechAssessment(segmentedEntries.third, technology)};
        case Quadrant.Fourth:
            return {...segmentedEntries, fourth: appendNewEntryToTechAssessment(segmentedEntries.fourth, technology)};
    }
}

export function grouping(technologies: Technology[]): EntryClassification<Technology> {
    const gp: (entries: EntryClassification<Technology>, tech: Technology, index: number, src: Technology[]) => EntryClassification<Technology> =
        (entries, tech, index, src) => appendNewEntryToSegmentedEntries(entries, tech);
    return technologies.reduce(gp, newSegmentedEntries());
}

export function sortingByNameGivingIndex(entries: EntryClassification<Technology>): EntryClassification<TechnologyWithIndex> {
    const [secondIndex, second] = sortByName(0, entries.second);
    const [firstIndex, first] = sortByName(secondIndex, entries.first);
    const [thirdIndex, third] = sortByName(firstIndex, entries.third);
    const [fin, fourth] = sortByName(thirdIndex, entries.fourth);
    return new EntryClassificationImpl(first, second, third, fourth);
}
