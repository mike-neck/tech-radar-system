import {Area} from "./area";
import {Technology} from "./entry-classification";
import {Quadrant, QuadrantAccess} from "./quadrant";
import {TechAssessment} from "./tech-assessment";

export type TechColors = {
    adopt: string;
    assess: string;
    trial: string;
    hold: string;
};

export interface Colors {
    background: string;
    backingText: string;
    grid: string;
    inactive: string;
    tech: TechColors;
}

function techColorsAsReadOnlyMap(techColors: TechColors): (assessment: TechAssessment) => string {
    return (assessment: TechAssessment) => {
        switch (assessment) {
            case TechAssessment.Adopt:
                return techColors.adopt;
            case TechAssessment.Assess:
                return techColors.assess;
            case TechAssessment.Trial:
                return techColors.trial;
            case TechAssessment.Hold:
                return techColors.hold;
        }
    };
}

export interface TechnologyClassNames {
    leftTop: string;
    rightTop: string;
    leftBottom: string;
    rightBottom: string;
}

function quadrantLegendTitle(technologyClassNames: TechnologyClassNames): (quadrant: Quadrant) => string {
    return (quadrant: Quadrant) => {
        switch (quadrant) {
            case Quadrant.First:
                return technologyClassNames.rightTop;
            case Quadrant.Second:
                return technologyClassNames.leftTop;
            case Quadrant.Third:
                return technologyClassNames.leftBottom;
            case Quadrant.Fourth:
                return technologyClassNames.rightBottom;
        }
    };
}

export interface RadarConfig {
    title: string;
    names: TechnologyClassNames;
    colors: Colors;
    printLayout: boolean;
    area: Area;
}

export interface Config {
    title: string;
    colors: Colors;
    printLayout: boolean;
    area: Area;

    color(technology: Technology): string;

    quadrantTitles: QuadrantAccess<string>;
}

export function newConfig(radarConfig: RadarConfig): Config {
    const techColor = techColorsAsReadOnlyMap(radarConfig.colors.tech);
    return {
        ...radarConfig,
        color(technology: Technology): string {
            if (technology.active || radarConfig.printLayout) {
                return techColor(technology.assessment);
            } else {
                return radarConfig.colors.inactive;
            }
        },
        quadrantTitles: {
            getByQuadrant(quadrant: Quadrant): string {
                const titleOf = quadrantLegendTitle(radarConfig.names);
                return titleOf(quadrant);
            }
        }
    };
}
