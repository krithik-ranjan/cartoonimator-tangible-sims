import * as React from 'react';
import { useState, useRef, useCallback, useEffect } from "react";

import { Titlebar } from '../../ui/Titlebar';
import { AsteroidSimInfo } from './SimInfo';
import { AsteroidSimulation } from './SimUtils';
import { BottombarHome, BottombarCapture } from '../../ui/Bottombar';
import { CameraPage } from './Camera';

import CameraBtn from '../../images/camera-btn.svg';

let simData = new AsteroidSimulation();

export default function AsteroidSim() {
    const [pageState, setPageState] = useState("home");
    simData.updateState("home");

    if (pageState === "home") {
        console.log("[pageState] home");
        simData.updateState("home");
        return (
            <div className="App">
                <Titlebar />
                <div className="Home">
                    <AsteroidSimInfo />
                    <CapturePreview setState={setPageState} simData={simData}/>
                </div>
                <BottombarHome />
            </div>
        )
    } 
    else if (pageState === "bg-camera") {
        console.log("[pageState] bg-camera");
        simData.updateState("bg-camera");
        return (
            <div className="App">
                <Titlebar /> 
                <CameraPage setState={setPageState} simData={simData}/>
            </div>
        )
    } 
    else if (pageState === "obj-camera") {
        console.log("[pageState] obj-camera");
        simData.updateState("obj-camera");
        return (
            <div className="App">
                <Titlebar /> 
                <CameraPage setState={setPageState} simData={simData}/>
            </div>
        )
    } 
}

function CapturePreview({setState, simData}) {
    const bgCanvasRef = useRef(null);
    const objCanvasRef = useRef(null);

    // let bgCapture = simData.getBackgroundImg();

    useEffect(() => {
        const bgCanvas = bgCanvasRef.current;
        simData.renderBackground(bgCanvas, 480, 320);

        // if (bgCapture !== null) {
        //     // Resize before showing on canvas
        //     let temp = new cv.Mat();
        //     let dsize = new cv.Size(480, 320);
        //     cv.resize(bgCapture, temp, dsize, 0, 0, cv.INTER_AREA);

        //     const canvas = bgCanvasRef.current;
        //     cv.imshow(canvas, temp);

        //     temp.delete();
        // }

        // if (objCapture !== null) {
        //     let temp = new cv.Mat();
        //     let dsize = new cv.Size(480, 320);
        //     cv.resize(objCapture, temp, dsize, 0, 0, cv.INTER_AREA);

        //     const canvas = objCanvasRef.current;
        //     cv.imshow(canvas, temp);

        //     temp.delete();
        // }
    }, []);

    return (
        <div className="PreviewPane">
            <h4>Background</h4>
            <div className="CapturePreview">
                <canvas 
                    ref={bgCanvasRef}
                    width={480}
                    height={320} />
                <img 
                    className="CameraBtn"
                    src={CameraBtn}
                    alt="Camera Button"
                    onClick={() => setState("bg-camera") }
                />
            </div>
            <h4>Objects</h4>
            <div className="CapturePreview">
                <canvas 
                    ref={objCanvasRef}
                    width={480}
                    height={320} />
                <img 
                    className="CameraBtn"
                    src={CameraBtn}
                    alt="Camera Button"
                    onClick={() => setState("obj-camera") }
                />
            </div>
            
        </div>
    )
}

