import * as React from 'react';
import { useState, useRef, useCallback, useEffect } from "react";

import { Titlebar } from '../../ui/Titlebar';
import { AsteroidSimInfo } from './SimInfo';
import { AsteroidSimulation } from './SimUtils';
import { CameraPage } from './Camera';
import { PlayPage } from './Play';

import CameraBtn from '../../images/camera-btn.svg';
import PlayBtn from '../../images/play-btn.svg';

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
                <Bottombar onClick={() => setPageState("play")} />
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
    else if (pageState === "play") {
        console.log("[pageState] play");
        simData.updateState("play");
        return (
            <div className="App">
                <Titlebar />
                <PlayPage setState={setPageState} simData={simData}/>
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
        simData.previewBackground(bgCanvas, 480, 320);

        const objCanvas = objCanvasRef.current;
        simData.previewObjects(objCanvas, 480, 320);
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
                    onClick={() => setState("obj-camera")}
                />
            </div>
            
        </div>
    )
}

function Bottombar({onClick}) {
    return (
        <div className="Bottombar">
            <img 
                className="PlayBtn"
                src={PlayBtn}
                alt="Play Button"
                onClick={() => {onClick()}}
            />
        </div>
    )
}
