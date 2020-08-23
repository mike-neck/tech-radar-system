import {Area} from "./area";
import {Cartesian} from "./figure-types";
import {Offset} from "./offset";

export function translateArea(area: Area): string {
    return `translate(${area.width},${area.height})`;
}

function translateCartesian(cartesian: Cartesian): string {
    return `translate(${cartesian.x},${cartesian.y})`;
}

export function translateOffset(offset: Offset): string {
    return `translate(${offset.x},${offset.y})`;
}
