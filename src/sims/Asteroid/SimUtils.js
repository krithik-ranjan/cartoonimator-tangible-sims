import { findMarkers, findObjects, flattenFrame, renderObjectOnBg } from "../../utils/CVUtils";

const REQD_MARKERS = [
    10, // Top left 
    11, // Top right
    12, // Bottom right
    13, // Bottom left
    103, // Sun
    100, // Focus
    101  // Asteroid
]

export const AsteroidSimulation = class {
    constructor() {
        this.width = 1080;
        this.height = 720;

        this.pageState = "";
        this.currentCapture = null;

        this.background = null;
        this.sun = null;
        this.asteroid = null;

        this.sunPos = { x: 0, y: 0};
        this.asteroidPos = { x: 0, y: 0};
        this.focusPos = { x: 0, y: 0};

        this.objectImg = null;

        this.simulationReady = false;
    }

    updateState(newState) {
        this.pageState = newState;    
    }

    getState() {
        return this.pageState;
    }

    updateCurrentCapture(capture) {
        if (this.currentCapture !== null)
            capture.copyTo(this.currentCapture);
        else 
            this.currentCapture = capture.clone();
        // console.log("Updated current capture");
    }

    getCurrentCapture() {
        return this.currentCapture;
    }

    checkBgMarkers(img, markers) {
        findMarkers(img, markers);
    
        let found = true;
        
        let i;
        for (i = 0; i < 4; i++) {
            if (!markers.has(REQD_MARKERS[i]))
                found = false;
        }
    
        if (found) this.updateCurrentCapture(img);
        return found;
    }

    checkObjMarkers(img, markers) {
        findMarkers(img, markers);
    
        let found = true;
        
        let i;
        for (i = 0; i < 7; i++) {
            if (!markers.has(REQD_MARKERS[i]))
                found = false;
        }
    
        if (found) this.updateCurrentCapture(img);
        return found;
    }

    addBackground() {
        let markers = new Map();
        findMarkers(this.currentCapture, markers);
        
        this.background = new cv.Mat();
        let _ = flattenFrame(this.currentCapture, this.background, markers, this.width, this.height);
    
        console.log("[INFO] Added background");
    }

    previewBackground(canvas, width, height) {
        if (this.background !== null) {
            let temp = new cv.Mat();
            let dsize = new cv.Size(width, height);

            cv.resize(this.background, temp, dsize, 0, 0, cv.INTER_AREA);
            cv.imshow(canvas, temp);

            temp.delete();

            console.log("[DEBUG] Rendered background");
        }
    }

    addObjects() {
        let markers = new Map();
        findMarkers(this.currentCapture, markers);

        // Flatten image with an offset
        let capture = new cv.Mat();
        let M = flattenFrame(this.currentCapture, capture, markers, this.width, this.height);

        // Find objects in the flattened image
        let objects = new Map();
        this.objectImg = this.background.clone();
        // this.objectImg = capture.clone();
        findObjects(capture, markers, M, objects);

        // Add sun 
        if (objects.has(103)) {
            this.sun = objects.get(103).img;
            this.sunPos = objects.get(103).center;

            renderObjectOnBg(this.objectImg, this.sun, this.sunPos);
            console.log(`[INFO] Added sun at ${this.sunPos.x}, ${this.sunPos.y}`);
        }

        // Add asteroid 
        if (objects.has(101)) {
            this.asteroid = objects.get(101).img;
            this.asteroidPos = objects.get(101).center;

            renderObjectOnBg(this.objectImg, this.asteroid, this.asteroidPos);
            console.log(`[INFO] Added asteroid at ${this.asteroidPos.x}, ${this.asteroidPos.y}`);
        }

        // Add focus 
        if (objects.has(100)) {
            this.focusPos = objects.get(100).center;

            console.log(`[INFO] Added focus at ${this.focusPos.x}, ${this.focusPos.y}`);
        }

        this.simulationReady = objects.has(100) && objects.has(101) && objects.has(103);
        capture.delete();
    }

    previewObjects(canvas, width, height) {
        if (this.objectImg !== null) {
            console.log("[DEBUG] Rendering objects");

            let temp = new cv.Mat();
            let dsize = new cv.Size(width, height);

            cv.resize(this.objectImg, temp, dsize, 0, 0, cv.INTER_AREA);
            cv.imshow(canvas, temp);

            temp.delete();

            console.log("[DEBUG] Rendered objects");
        }
    }

    animateOrbit(canvas, frameCount, width, height) {
        // Dummy animation -- need to fix
        if (this.simulationReady) {
            let frame = this.background.clone();

            // Place the sun at the center
            renderObjectOnBg(frame, this.sun, {x: Math.floor(this.width / 2), y: Math.floor(this.height / 2)});

            // Calculate the asteroid's position in the orbit 
            let angularSpeed = 0.08;
            let theta = frameCount * angularSpeed;
            let radius = Math.floor(this.height / 3);
            this.asteroidPos.x = Math.floor(this.width / 2) + radius * Math.cos(theta);
            this.asteroidPos.y = Math.floor(this.height / 2) + radius * Math.sin(theta);
            
            renderObjectOnBg(frame, this.asteroid, this.asteroidPos);

            // Resize frame to fit on canvas 
            let temp = new cv.Mat();
            let dsize = new cv.Size(width, height);

            cv.resize(frame, temp, dsize, 0, 0, cv.INTER_AREA);
            cv.imshow(canvas, temp);

            temp.delete();
            frame.delete();
        }
    }
}