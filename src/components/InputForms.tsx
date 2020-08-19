import React, {ChangeEventHandler, ReactElement, useState} from "react";
import {BasicColor, BasicColorCandidates, FontSize, RectangleText} from "./Rectangle";

class AxisBuilder implements Iterator<number>, Iterable<number> {
    max: number;
    previous: number;
    current: number;

    constructor(selectedSize: number, max: number) {
        this.max = max - selectedSize;
        this.current = 10;
        this.previous = 0;
    }

    [Symbol.iterator](): Iterator<number> {
        return this;
    }

    next(): IteratorResult<number> {
        const next = this.previous + this.current;
        if (this.max < next) {
            return {
                done: true, value: undefined
            };
        } else {
            this.previous = this.current;
            this.current = next;
            return {
                done: false, value: next
            };
        }
    }
}

function newSelectableCandidateNumbers<T extends number>(selected: T, max: number): number[] {
    const axisBuilder = new AxisBuilder(selected, max);
    const array: number[] = [0];
    // @ts-ignore
    for (const item of axisBuilder) {
        array.push(item);
    }
    return array;
}

type OnChangeHandler<T> = (item: T) => void;

type SelectableHeight = 10 | 20 | 30 | 50 | 80 | 130;
const allSelectableHeight: SelectableHeight[] = [10, 20, 30, 50, 80, 130];

export const MaxVerticalAxis = 300

type SelectableWidth = SelectableHeight | 210;
const allSelectableWidth: SelectableWidth[] = [...allSelectableHeight, 210];

export const MaxHorizontalAxis = 500

const availableFontSize: FontSize[] = [11, 12, 13, 15, 18, 23, 31, 34];

function Selector<T extends number>(param: { initialValue: T, candidates: T[], handler: OnChangeHandler<T> }): ReactElement {
    const [selector, setSelector] = useState<T>(param.initialValue);
    const changeEventHandler: ChangeEventHandler<HTMLSelectElement> = event => {
        const value = event.target.value;
        try {
            const int = Number(value);
            const newValue = int as T;
            setSelector(newValue);
            param.handler(newValue);
        } catch (e) {
        }
    };
    return (
        <select multiple={false} value={selector} onChange={changeEventHandler}>
            {
                param.candidates.map((w: T) => (<option key={`${w}`} value={w}>{w}</option>))
            }
        </select>
    );
}

type ScaleName = "width" | "height";
type AxisName = "x" | "y";
type CooperativeProperty = { scaleName: ScaleName, axisName: AxisName, max: number };
const cooperativeProperty = {
    horizon: { scaleName: "width" as ScaleName, axisName: "x" as AxisName, max: MaxHorizontalAxis },
    vertex: { scaleName: "height" as ScaleName, axisName: "y" as AxisName, max: MaxVerticalAxis },
};

export function InputForms(param: { onNewObject: (newObject: RectangleText) => void }): ReactElement {
    const initialWidth = 30;
    const initialHeight = 20;

    const [horizontalSelector, setHorizontalSelector] = useState(newSelectableCandidateNumbers(initialWidth, MaxHorizontalAxis));
    const [verticalSelector, setVerticalSelector] = useState(newSelectableCandidateNumbers(initialHeight, MaxVerticalAxis));
    const initialObject: RectangleText = {
        text: "",
        color: "black",
        width: initialWidth,
        height: initialHeight,
        axis: {
            x: 0,
            y: 0
        },
        fontSize: 13,
    };
    const [object, setObject] = useState(initialObject);

    function update(name: string, value: any) {
        const newObject = { ...object, [name]: value };
        setObject(newObject);
    }
    function updateScale(property: CooperativeProperty, value: number, updater: (newValue: number[]) => void) {
        update(property.scaleName, value);
        const newRange = newSelectableCandidateNumbers(value, property.max);
        if (!newRange.includes(object.axis[property.axisName])) {
            const newAxis = { ...object.axis, [property.axisName]: 0 };
            update("axis", newAxis);
        }
        updater(newRange);
    }
    function updateAxis(name: AxisName, value: number) {
        const newAxis = { ...object.axis, [name]: value };
        update("axis", newAxis);
    }

    return (
        <div>
            <div>
                <div>
                    <label>横幅</label>
                    <Selector<SelectableWidth>
                        initialValue={initialWidth} candidates={allSelectableWidth}
                        handler={(value: SelectableWidth) => {updateScale(cooperativeProperty.horizon, value, setHorizontalSelector)}}
                    />
                </div>
                <div>
                    <label>縦幅</label>
                    <Selector<SelectableHeight>
                        initialValue={initialHeight}
                        candidates={allSelectableHeight}
                        handler={ (value: SelectableHeight) => { updateScale(cooperativeProperty.vertex, value, setVerticalSelector) }}
                    />
                </div>
            </div>
            <div>
                <div>
                    <label>横位置</label>
                    <Selector initialValue={0} candidates={horizontalSelector} handler={ (value: number) => updateAxis("x", value) } />
                </div>
                <div>
                    <label>縦位置</label>
                    <Selector initialValue={0} candidates={verticalSelector} handler={ (value: number) => updateAxis("y", value) } />
                </div>
            </div>
            <div>
                <label>テキスト</label>
                <input type="text" onChange={event => update("text", event.target.value)} value={object.text}/>
                <label>フォントサイズ</label>
                <Selector<FontSize> initialValue={13} candidates={availableFontSize} handler={value => update("fontSize", value)}/>
            </div>
            <div>
                <label>色</label>
                <select value={object.color} onChange={event => update("color", event.target.value)}>
                    {
                        BasicColorCandidates.map((color: BasicColor) => (<option key={color} value={color}>{ color }</option>))
                    }
                </select>
            </div>
            <button type="button" onClick={ () => param.onNewObject(object) }>create new</button>
        </div>
    );
}
