import React, {useEffect, useRef, useState} from "react";
import {translateOffset} from "./transform-translate";

type BubbleLabel = {
    index: number,
    x: number,
    y: number,
    text: string,
};

type BubbleAttr = {
    x: number,
    y: number,
    opacity: 0 | 0.8,
    pointerEvents: "none",
    userSelect: "none",
    transform: string | undefined,
};

type BubbleRectAttr = {
    x: undefined | -5,
    y: undefined | number,
    width: undefined | number,
    height: undefined | number,
};

export function Bubble(props: { label: BubbleLabel | null }) {
    const label = props.label;
    const initialBubbleAttr: BubbleAttr = {
        x: 0,
        y: 0,
        opacity: 0,
        pointerEvents: "none",
        userSelect: "none",
        transform: undefined,
    };
    const [bubbleAttr, setBubbleAttr] = useState(initialBubbleAttr);
    const initialBubbleRectAttr: BubbleRectAttr = {
        height: undefined,
        width: undefined,
        x: undefined,
        y: undefined,
    };
    const [rectAttr, setRectAttr] = useState(initialBubbleRectAttr);
    // using `useRef`, it is available to get the width of text text element.
    // see https://stackoverflow.com/questions/43817118/how-to-get-the-width-of-a-react-element
    const textRef = useRef<SVGTextElement | null>(null);
    const [pathTransform, setPathTransform] = useState<string | undefined>(undefined);

    useEffect(() => {
        const current: SVGTextElement | null = textRef.current;
        if (label !== null && current !== null) {
            const bBox = current.getBBox();
            setBubbleAttr({
                ...bubbleAttr,
                opacity: 0.8,
                transform: translateOffset({x: label.x - bBox.width / 2, y: label.y - 16}),
            });
            setRectAttr({
                ...rectAttr,
                x: -5,
                y: -bBox.height,
                width: bBox.width + 10,
                height: bBox.height + 4,
            });
            setPathTransform(translateOffset({x: bBox.width / 2 - 5, y: 3}));
        }
    }, [label]);

    // noinspection HtmlUnknownAttribute
    return (
        // @ts-ignore
        <g id="bubble"
           x={bubbleAttr.x}
           y={bubbleAttr.y}
           opacity={bubbleAttr.opacity}
           transform={bubbleAttr.transform}
           pointerEvents={bubbleAttr.pointerEvents}
           user-select={bubbleAttr.userSelect}>
            <rect
                rx={4}
                ry={4}
                fill="#333"
                x={rectAttr.x}
                y={rectAttr.y}
                width={rectAttr.width}
                height={rectAttr.height}
            />
            <text
                ref={textRef}
                fill="#fff"
                style={{fontFamily: "sans-serif, Arial, Menlo, Helvetica", fontSize: 10}}
            >{label?.text}</text>
            <path
                d="M 0,0 10,0 5,8 z"
                fill="#333"
                transform={pathTransform}
            />
        </g>
    );
}
