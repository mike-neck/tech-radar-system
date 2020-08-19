import React from "react";

export interface Scale {
    width: number;
    height: number;
}

export const Svg: React.FC<Scale> = ({ children, width, height }) => {
    return (
        <svg style={{ width: width, height: height }}>
            { children }
        </svg>
    );
};
