import React, {useState} from "react";
import {RectangleText, RectangleTexts} from "./Rectangle";
import {InputForms, MaxHorizontalAxis, MaxVerticalAxis} from "./InputForms";
import {Svg} from "./Svg";

export const Canvas: React.FC = () => {
    const [rects, setRects] = useState([] as RectangleTexts);
    return (
        <>
            <InputForms onNewObject={ (rect: RectangleText) => setRects([...rects, rect]) }/>
            <Svg width={MaxHorizontalAxis} height={MaxVerticalAxis}>
                <RectangleTexts items={ rects }/>
            </Svg>
        </>
    );
};
