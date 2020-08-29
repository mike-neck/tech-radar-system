import {orderedQuadrants, Quadrant} from "./quadrant";
import {TechAssessment, techAssessmentAsString, techAssessments} from "./tech-assessment";
import {
    legendHorizontalOffset,
    legendVerticalOffset,
    LegendVerticalOffset,
    LegendVerticalOffsetConfig,
    Offset,
    quadrantLegendOffset
} from "./offset";
import React, {ReactElement, useState} from "react";
import {EntryClassification, ViewableTech} from "./entry-classification";
import {Config} from "./config";
import {translateOffset} from "./transform-translate";

export function Legend(params: { config: Config, entries: EntryClassification<ViewableTech> }): ReactElement {
    const config = params.config;
    const entries = params.entries;

    const verticalOffset = legendVerticalOffset(entries);

    function legendTransform(quadrant: Quadrant, assessment: TechAssessment, vertical: LegendVerticalOffset): string {
        const horizontalOffset = legendHorizontalOffset(assessment);
        const offset = quadrantLegendOffset(quadrant);
        return translateOffset({
            x: offset.x + horizontalOffset.length,
            y: offset.y + vertical.length,
        });
    }

    return (
        <g>
            <QuadrantTitle config={config}/>
            <TechAssessmentTitle legendTransform={legendTransform} verticalOffset={verticalOffset}/>
            <ItemNames entries={entries} legendTransform={legendTransform} verticalOffset={verticalOffset}/>
        </g>
    );
}

function QuadrantTitle(params: { config: Config }): ReactElement {
    const config = params.config;
    const quadrants = orderedQuadrants();
    return (
        <>{
            quadrants
                .map(quadrant => [
                    config.quadrantTitles.getByQuadrant(quadrant),
                    quadrantLegendOffset(quadrant)] as [string, Offset])
                .map((pair: [string, Offset]) => (
                    <text
                        key={`legend-title-${pair[0]}`}
                        transform={translateOffset({x: pair[1].x, y: pair[1].y - 45})}
                        style={{fontFamily: "Arial, Menlo, Helvetica", fontSize: 18}}
                    >
                        {pair[0]}
                    </text>))
        }</>
    );
}

function TechAssessmentTitle(params: {
    legendTransform: (quadrant: Quadrant, assessment: TechAssessment, vertical: LegendVerticalOffset) => string,
    verticalOffset: (quadrant: Quadrant, assessment: TechAssessment) => LegendVerticalOffsetConfig,
}): ReactElement {
    const quadrants = orderedQuadrants();
    return (<>{
        quadrants
            .flatMap(quadrant =>
                techAssessments().map(assessment =>
                    [quadrant, assessment, params.verticalOffset(quadrant, assessment).title]) as [[Quadrant, TechAssessment, LegendVerticalOffset]]
            ).map((pair: [Quadrant, TechAssessment, LegendVerticalOffset]) =>
            (<text
                key={`inner-legend-title-${pair[0]}-${pair[1]}`}
                transform={params.legendTransform(pair[0], pair[1], pair[2])}
                style={{fontFamily: "Arial, Menlo, Helvetica", fontSize: 12, fontWeight: "bold"}}
            >{
                techAssessmentAsString(pair[1])
            }</text>))
    }</>);
}

function ItemNames(params: {
    entries: EntryClassification<ViewableTech>,
    legendTransform: (quadrant: Quadrant, assessment: TechAssessment, vertical: LegendVerticalOffset) => string,
    verticalOffset: (quadrant: Quadrant, assessment: TechAssessment) => LegendVerticalOffsetConfig,
}): ReactElement {
    return (<>{
        params.entries
            .mapAsArray((item, allIndex, indexInQuadrants, indexInAssessments) =>
                (<ItemName
                    key={ `item-legend-${item.quadrant}-${item.assessment}` }
                    item={item}
                    indexInAssessments={indexInAssessments}
                    legendTransform={params.legendTransform}
                    verticalOffset={params.verticalOffset}/>))
    }</>);
}

function ItemName(params: {
    item: ViewableTech,
    indexInAssessments: number,
    legendTransform: (quadrant: Quadrant, assessment: TechAssessment, vertical: LegendVerticalOffset) => string,
    verticalOffset: (quadrant: Quadrant, assessment: TechAssessment) => LegendVerticalOffsetConfig,
}): ReactElement {
    const item = params.item;
    const [mouseOver, setMouseOver] = useState(false);

    const mouseOverHandler = () => {
        setMouseOver(true);
    };
    const mouseOutHandler = () => {
        setMouseOver(false);
    };

    if (mouseOver) {
        return (<text
            key={`legend-guide-${item.quadrant}-${item.assessment}-${item.name}`}
            transform={
                params.legendTransform(
                    item.quadrant, item.assessment,
                    params.verticalOffset(item.quadrant, item.assessment)
                        .lengthAt(params.indexInAssessments))
            }
            className={`legend-${item.quadrant}-${item.assessment}`}
            id={`legend-${item.index}`}
            style={{fontFamily: "Arial, Menlo, Helvetica", fontSize: 11}}
            filter="url(#solid)"
            fill="white"
            onMouseOver={mouseOverHandler}
            onMouseOut={mouseOutHandler}
        >
            {`${item.index} ${item.name}`}
        </text>);
    } else {
        return (<text
            key={`legend-guide-${item.quadrant}-${item.assessment}-${item.name}`}
            transform={
                params.legendTransform(
                    item.quadrant, item.assessment,
                    params.verticalOffset(item.quadrant, item.assessment)
                        .lengthAt(params.indexInAssessments))
            }
            className={`legend-${item.quadrant}-${item.assessment}`}
            id={`legend-${item.index}`}
            style={{fontFamily: "Arial, Menlo, Helvetica", fontSize: 11}}
            onMouseOver={mouseOverHandler}
            onMouseOut={mouseOutHandler}
        >
            {`${item.index} ${item.name}`}
        </text>);
    }
}
