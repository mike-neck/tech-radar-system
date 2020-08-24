import {Range} from "./random";

export type Radius = number;
export type Cartesian = { x: number, y: number };
export type Rect = { leftTop: Cartesian, rightBottom: Cartesian };

export type Polar = { radius: Radius, theta: number };

export interface PolarRange {
    minRadius(param: { adjust: Radius }): Radius;

    maxRadius(param: { adjust: Radius }): Radius;

    radiusRange(): Range<Radius>;

    thetaRange(): Range<number>;
}

export function polarRange(min: Polar, max: Polar): PolarRange {
    return {
        minRadius(param: { adjust: Radius } = {adjust: 0}): Radius {
            return min.radius + param.adjust;
        },
        maxRadius(param: { adjust: Radius } = {adjust: 0}): Radius {
            return max.radius + param.adjust;
        }, radiusRange(): Range<Radius> {
            return {max: max.radius, min: min.radius};
        }, thetaRange(): Range<number> {
            return {max: max.theta, min: min.theta};
        }
    };
}

export function polar(cartesian: Cartesian): Polar {
    return {
        theta: Math.atan2(cartesian.y, cartesian.x),
        radius: Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y),
    };
}
