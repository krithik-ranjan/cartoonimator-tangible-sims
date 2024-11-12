import { findMarkers, flattenFrame } from "../../utils/CVUtils";

const REQD_MARKERS = [
    10, // Top left 
    11, // Top right
    12, // Bottom right
    13, // Bottom left
    110, // Sun
    111, // Focus
    112  // Asteroid
]

export function checkMarkers(img, markers) {
    findMarkers(img, markers);

    let found = true;
    
    let i;
    for (i = 0; i < 4; i++) {
        if (!markers.has(REQD_MARKERS[i]))
            found = false;
    }

    return found;
}

export const AsteroidSimulation = class {
    constructor() {
        this.width = 1080;
        this.height = 720;

        this.pageState = "";
        this.currentCapture = null;

        this.background = null;
    }

    updateState(newState) {
        this.pageState = newState;    
        console.log(this.pageState);
    }

    getState() {
        return this.pageState;
    }

    updateCurrentCapture(capture) {
        this.currentCapture = capture.clone();
        // console.log("Updated current capture");
    }

    getCurrentCapture() {
        return this.currentCapture;
    }

    addBackground() {
        let markers = new Map();
        findMarkers(this.currentCapture, markers);
        
        this.background = new cv.Mat();
        let _ = flattenFrame(this.currentCapture, this.background, markers, this.width, this.height);
    
        console.log("Added background");
    }

    renderBackground(canvas, width, height) {
        if (this.background !== null) {
            let temp = new cv.Mat();
            let dsize = new cv.Size(width, height);

            cv.resize(this.background, temp, dsize, 0, 0, cv.INTER_AREA);
            cv.imshow(canvas, temp);

            temp.delete();
        }
    }

    addObjects() {
        let markers = new Map();
        findMarkers(this.currentCapture, markers);

        // Flatten image with an offset
        let capture = new cv.Mat();
        let M = flattenFrame(this.currentCapture, capture, markers, this.width, this.height, 120, 120);

        // Find objects in the flattened image
        let objects = new Map();

    }
}