import React, {useEffect} from "react";
import * as d3 from "d3";

export type BasicColor = "black" | "blue" | "red" | "green";
export const BasicColorCandidates: BasicColor[] = ["black", "blue", "red", "green"];

export interface Axis {
    x: number;
    y: number;
}

export interface RectangleText {
    text: string;
    width: number;
    height: number;
    color: BasicColor;
    axis: Axis;
}

export type RectangleTexts = RectangleText[];

export const RectangleTexts: React.FC<{ items: RectangleTexts }> = ({ items }) => {
    useEffect(() => {
        const all = d3.select(".rects");

        const boxes = all.selectAll("rect")
            .data(items).enter()
            .append("g")
            .attr("transform", (datum) => `translate(${datum.axis.x}, ${datum.axis.y})`);
        boxes.append("rect")
            .attr("width", (datum) => datum.width)
            .attr("height", (datum) => datum.height)
            .attr("fill", (datum) => datum.color);
        boxes.append("text")
            .attr("transform", datum => `translate(0, ${datum.height})`)
            .attr("fill", "white")
            .style("font-size", datum => datum.width * 0.9)
            .text(datum => datum.text);
    });
    // noinspection CheckTagEmptyBody
    return (
        <g className="rects"></g>
    );
};
