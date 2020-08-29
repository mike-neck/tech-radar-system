import {Config} from "./config";
import {EntryClassification, Trend, ViewableTech} from "./entry-classification";
import React, {ReactElement} from "react";
import {translateCartesian} from "./transform-translate";


export function Blips(
    params: {
        config: Config,
        entries: EntryClassification<ViewableTech>,
        techSelected: (tech: ViewableTech) => void,
        techUnselected: () => void,
    }): ReactElement {
    const {config, entries, techSelected, techUnselected} = params;

    return (
        <g>
            {entries.mapAsArray(item => {
                return (<Blip
                    key={item.index}
                    config={config} tech={item}
                    techSelected={techSelected}
                    techUnselected={techUnselected}
                />);
            })}
        </g>
    );
}

function Blip(
    params: {
        config: Config,
        tech: ViewableTech,
        techSelected: (tech: ViewableTech) => void,
        techUnselected: () => void,
    }): ReactElement {
    const {config, tech, techSelected, techUnselected} = params;
    const cart = tech.cart;

    return (
        <g transform={translateCartesian(cart)}
           onMouseOver={ (e) => techSelected(tech) }
           onMouseOut={ (e) => techUnselected() }>
            <BlipShape config={config} tech={tech}/>
            <BlipText config={config} tech={tech}/>
        </g>
    );
}

function BlipShape(params: { config: Config, tech: ViewableTech }): ReactElement {
    const {config, tech} = params;
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