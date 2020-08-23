export interface Range<N extends number> {
    max: N;
    min: N;
}

export class Random {
    seed: number;

    constructor() {
        this.seed = 42;
    }

    random(): number {
        const gen = Math.sin(this.seed++) * 10_000;
        return gen - Math.floor(gen);
    }

    randomBetween<N extends number>(range: Range<N>): number {
        return range.min + this.random() * (range.max - range.min);
    }

    normalBetween<N extends number>(range: Range<N>): number {
        return range.min + (this.random() * this.random()) * 0.5 * (range.max - range.min);
    }
}