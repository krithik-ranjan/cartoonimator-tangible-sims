import { findMarkers } from "../../utils/CVUtils";

const REQD_MARKERS = [
    10, // Top left 
    11, // Top right
    12, // Bottom right
    13, // Bottom left
    110, // Sun
    111, // Focus
    112  // Asteroid
]

export function checkMarkers(img) {
    let markers = new Map();
    findMarkers(img, markers);

    let found = true;
    
    let i;
    for (i = 0; i < 1; i++) {
        if (!markers.has(REQD_MARKERS[i]))
            found = false;
    }

    return found;
}