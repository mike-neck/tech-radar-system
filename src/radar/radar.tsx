import React, {ReactElement} from "react";
import {TechAssessment, techAssessmentAsString, techAssessments} from "./tech-assessment";
import {Quadrant} from "./quadrant";
import {
    EntryClassification,
    grouping,
    sortingByNameGivingIndex,
    Technology,
    TechnologyWithIndex
} from "./entry-classification";
import {Random, Range} from "./random";
import {LeftEdge, Offset} from "./offset";
import {Cartesian, Polar, PolarRange, polarRange, Radius, Rect} from "./figure-types";
import {translateArea, translateOffset} from "./transform-translate";
import {Colors, Config, newConfig, RadarConfig} from "./config";
import {Legend} from "./legend";

type RadialUnit = -1 | -0.5 | 0 | 0.5 | 1;
type FactorUnit = -1 | 1;

interface QuadrantArea {
    minRadial: RadialUnit;
    maxRadial: RadialUnit;
    factorX: FactorUnit;
    factorY: FactorUnit;
}

const Quadrants: Map<Quadrant, QuadrantArea> = new Map([
    [Quadrant.First, {minRadial: 0, maxRadial: 0.5, factorX: 1, factorY: 1}],
    [Quadrant.Second, {minRadial: 0.5, maxRadial: 1, factorX: -1, factorY: 1}],
    [Quadrant.Third, {minRadial: -1, maxRadial: -0.5, factorX: -1, factorY: -1}],
    [Quadrant.Fourth, {minRadial: -0.5, maxRadial: 0, factorX: 1, factorY: -1}],
]);

function quadrantAreas(quadrant: Quadrant): QuadrantArea {
    const area = Quadrants.get(quadrant);
    if (typeof area === "undefined") {
        throw new Error(`unknown quadrant: ${quadrant}`);
    }
    return area;
}

const MinimumRadius: Radius = 30;
const DrawingAreaHalfWidth = 400;
const Rings: Map<TechAssessment, Range<Radius>> = new Map<TechAssessment, Range<Radius>>([
    [TechAssessment.Adopt, {min: MinimumRadius, max: 130}],
    [TechAssessment.Trial, {min: 130, max: 220}],
    [TechAssessment.Assess, {min: 220, max: 310}],
    [TechAssessment.Hold, {min: 310, max: DrawingAreaHalfWidth}],
]);

const TitleOffset: Offset = {x: LeftEdge, y: -420};
const FooterOffset: Offset = {x: 0, y: 0};

function polar(cartesian: Cartesian): Polar {
    return {
        theta: Math.atan2(cartesian.y, cartesian.x),
        radius: Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y),
    };
}

function cartesian(polar: Polar): Cartesian {
    return {
        x: polar.radius * Math.cos(polar.theta),
        y: polar.radius * Math.sin(polar.theta),
    };
}

function boundedIn<N extends number>(range: Range<N>): (value: N) => N {
    const low = Math.min(range.min, range.max) as N;
    const high = Math.max(range.min, range.max) as N;
    return value => Math.min(Math.max(value, low), high) as N;
}

function boundedInRing(min: Radius, max: Radius): (polar: Polar) => Polar {
    const bound = boundedIn({min: min, max: max});
    return polar => ({
        radius: bound(polar.radius),
        theta: polar.theta,
    });
}

function boundedInRect(rect: Rect): (cartesian: Cartesian) => Cartesian {
    const x = boundedIn({min: rect.leftTop.x, max: rect.rightBottom.x});
    const y = boundedIn({min: rect.leftTop.y, max: rect.rightBottom.y});
    return cartesian => ({
        x: x(cartesian.x),
        y: y(cartesian.y),
    });
}

function newPolarRange(quadrant: Quadrant, techAssessment: TechAssessment): PolarRange {
    const ring = Rings.get(techAssessment);
    if (typeof ring === "undefined") {
        throw new Error(`unknown TechAssessment: ${techAssessment}`);
    }
    const area = Quadrants.get(quadrant);
    if (typeof area === "undefined") {
        throw new Error(`unknown Quadrant: ${quadrant}`);
    }
    return polarRange(
        {radius: ring.min, theta: area.minRadial * Math.PI},
        {radius: ring.max, theta: area.maxRadial * Math.PI}
    );
}

function newRect(quadrant: Quadrant, techAssessment: TechAssessment): Rect {
    const area = Quadrants.get(quadrant);
    if (typeof area === "undefined") {
        throw new Error(`unknown quadrant: ${quadrant}`);
    }
    return {
        leftTop: {
            x: MinimumRadius * area.factorX / 2,
            y: MinimumRadius * area.factorY / 2,
        },
        rightBottom: {
            x: DrawingAreaHalfWidth * area.factorX,
            y: DrawingAreaHalfWidth * area.factorY,
        },
    };
}

interface Segment {
    clip(cartesian: Cartesian): Cartesian;

    random(): Cartesian;
}

function newSegment(quadrant: Quadrant, techAssessment: TechAssessment): Segment {
    const polarRange: PolarRange = newPolarRange(quadrant, techAssessment);
    const rect: Rect = newRect(quadrant, techAssessment);
    return {
        clip(cart: Cartesian): Cartesian {
            const boundedCart = boundedInRect(rect)(cart);
            const p = polar(boundedCart);
            const boundedPolar = boundedInRing(
                polarRange.minRadius({adjust: MinimumRadius / 2}),
                polarRange.maxRadius({adjust: MinimumRadius / 2}))(p);
            return cartesian(boundedPolar);
        }, random(): Cartesian {
            const random = new Random();
            const polar: Polar = {
                radius: random.normalBetween(polarRange.radiusRange()),
                theta: random.randomBetween(polarRange.thetaRange()),
            };
            return cartesian(polar);
        }
    };
}

function model(technologies: Technology[]): EntryClassification<TechnologyWithIndex> {
    const grp = grouping(technologies);
    return sortingByNameGivingIndex(grp);
}

export function Radar(params: { radarConfig: RadarConfig, technologies: Technology[] }): ReactElement {
    // create segment, adding color from config
    const config = newConfig(params.radarConfig);
    // create group(by territory=quadrant)(by techAssessment)
    // give id to the entries(2nd>1st>3rd>4th quadrant)
    const entries = model(params.technologies);
    // create svg
    const area = config.area;
    return (
        <svg width={area.width} height={area.height} style={{backgroundColor: config.colors.background}}>
            <g transform={translateArea({width: area.width / 2, height: area.height / 2})}>
                <Figure config={config} entries={entries}/>
            </g>
        </svg>
    );
}

function Figure(params: { config: Config, entries: EntryClassification<TechnologyWithIndex> }): ReactElement {
    // stroke x-axis/y-axis
    // add filter
    // stroke circle
    // add text: techAssessment
    const grid = (<Grid config={params.config}/>);
    // add header/footer
    const title = (<Title title={params.config.title} />);
    const guide = (<Guide/>);
    // add legend for items
    const legend = (<Legend config={params.config} entries={params.entries}/>);
    // add bubble(tooltip/handler)
    // add rink(plots)
    return (
        <g>
            { grid }
            { title }
            { guide }
            { legend }
        </g>
    );
}

function Grid(params: { config: Config }): ReactElement {
    return (
        <g>
            <Axis colors={params.config.colors}/>
            <Defs/>
            <AllRings config={params.config}/>
        </g>
    );
}

function Axis(params: { colors: Colors }): ReactElement {
    const colors = params.colors;
    // noinspection CheckTagEmptyBody
    return (
        <>
            <line x1={0} y1={-400} x2={0} y2={400} strokeWidth={1} stroke={colors.grid}/>
            <line x1={-400} y1={0} x2={400} y2={0} strokeWidth={1} stroke={colors.grid}/>
        </>
    );
}

function Defs(): ReactElement {
    return (
        <defs>
            <filter x={0} y={0} width={1} height={1} id="solid">
                <feFlood floodColor="rgb(0,0,0,0.8)"/>
                <feComposite in="SourceGraphic"/>
            </filter>
        </defs>
    );
}

function UnitRings(params: { config: Config, techAssessment: TechAssessment }): ReactElement {
    const radius = Rings.get(params.techAssessment);
    if (typeof radius === "undefined") {
        throw new Error(`unknown tech-assessment: ${params.techAssessment}`);
    }
    const circle = (<circle
        cx="0"
        cy="0"
        r={radius.max}
        fill="none"
        stroke={params.config.colors.grid}
        strokeWidth="1"
    />);
    if (params.config.printLayout) {
        const assessmentString = techAssessmentAsString(params.techAssessment);
        // noinspection HtmlUnknownAttribute
        return (
            <>
               { circle }
                //@ts-ignore
                <text
                   textAnchor="middle"
                   fill={params.config.colors.backingText}
                   fontFamily="Arial, Menlo, Helvetica"
                   fontSize="42"
                   fontWeight="bold"
                   pointerEvents="none"
                   user-select="none"
               >{ assessmentString }</text>
            </>
        );
    } else {
        return circle;
    }
}

function AllRings(params: { config: Config }): ReactElement {
    const assessments = techAssessments();
    return (
        <>
            { assessments.map((assessment) =>
                (<UnitRings config={params.config} techAssessment={assessment}/>)
            ) }
        </>
    );
}

function Title(params: { title: string }): ReactElement {
    return (
        <text
            transform={translateOffset(TitleOffset)}
            style={{ fontFamily: "Arial, Menlo, Helvetica", fontSize: 34 }}
        >
            { params.title }
        </text>
    );
}

// noinspection HtmlUnknownAttribute
const Guide: React.FC = () => (
    <text
        transform={translateOffset(FooterOffset)}
        // @ts-ignore
        space="preserve"
        style={{ fontFamily: "Arial, Menlo, Helvetica", fontSize: 10 }}
    >▲ moved up     ▼ moved down</text>
);

