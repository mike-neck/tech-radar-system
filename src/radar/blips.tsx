import {Config} from "./config";
import {EntryClassification, Technology, Trend, ViewableTech} from "./entry-classification";
import {Cartesian} from "./figure-types";
import React, {ReactElement} from "react";
import {translateCartesian} from "./transform-translate";


export function Blips(
    params: {
        config: Config,
        entries: EntryClassification<ViewableTech>,
        position: (tech: Technology) => Cartesian,
    }): ReactElement {
    const config = params.config;
    const entries = params.entries;
    const position = params.position;

    return (
        <g>
            {entries.mapAsArray(item => {
                return (<Blip key={item.index} config={config} tech={item} position={position}/>);
            })}
        </g>
    );
}

function Blip(
    params: {
        config: Config,
        tech: ViewableTech,
        position: (tech: Technology) => Cartesian,
    }): ReactElement {
    const config = params.config;
    const tech = params.tech;
    const position = params.position;
    const cart = position(tech);

    return (
        <g transform={translateCartesian(cart)}>
            <BlipShape config={config} tech={tech}/>
            <BlipText config={config} tech={tech}/>
        </g>
    );
}

function BlipShape(params: { config: Config, tech: ViewableTech }): ReactElement {
    const config = params.config;
    const tech = params.tech;
    const color = config.color(tech);
    switch (tech.move) {
        case Trend.UP:
            return (<path d="M -11,5 11,5 0,-13 z" fill={color}/>);
        case Trend.DOWN:
            return (<path d="M -11,-5 11,-5 0,13 z" fill={color}/>);
        case Trend.KEEP:
            return (<circle r={9} fill={color}/>);
    }
}

function BlipText(params: { config: Config, tech: ViewableTech }): ReactElement | null {
    const config = params.config;
    const tech = params.tech;
    if (tech.active || config.printLayout) {
        const fontSize = tech.index.length < 2 ? 8 : 9;
        // noinspection HtmlUnknownAttribute
        return (
            <text
                y={3}
                fill="#fff"
                style={{fontFamily: "Arial, Menlo, Helvetica", fontSize: fontSize}}
                pointerEvents="none"
                user-select="none"
            >{tech.index}</text>
        );
    } else {
        return null;
    }
}