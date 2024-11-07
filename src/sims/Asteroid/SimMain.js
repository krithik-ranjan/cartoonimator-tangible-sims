import * as React from 'react';
import { useState, useRef, useCallback, useEffect } from "react";

import { Titlebar } from '../../ui/Titlebar';
import { AsteroidSimInfo } from './SimInfo';
import { BottombarHome, BottombarCapture } from '../../ui/Bottombar';
import { CameraPreview } from '../../ui/CameraPreview';

import processCapture from '../../utils/ProcessCapture';

import CameraBtn from '../../images/camera-btn.svg';

export default function AsteroidSim() {
    const [pageState, setPageState] = useState("home");

    // const webcamRef = useRef(null);
    // const captureCanvasRef = useRef(null);
    // const [capture, setCapture] = useState(null);

    // const captureFrame = useCallback(() => {
    //     const image = webcamRef.current.getScreenshot();
    //     console.log(`Capturing... ${image}`);

    //     setCapture(image);
    // }, [webcamRef]);

    // If capture not null

    if (pageState === "home") {
        return (
            <div className="App">
                <Titlebar />
                <div className="Home">
                    <CapturePreview setState={setPageState} />
                    <AsteroidSimInfo />
                </div>
                <BottombarHome />
            </div>
        )
    } 
    else if (pageState === "camera") {
        return (
            <div className="App">
                <Titlebar />
                <div className="Camera">
                    <CameraPreview />
                    {/* <img id="ImageCapture" src={capture} width={1080} height={640}/>
                    <canvas id="TestCapture" width={1080} height={640} /> */}
                </div>
                <BottombarCapture onClick={() => {}}/>
            </div>
        )
    } 
}

function CapturePreview({setState}) {
    return (
        <div className="CapturePreview">
            {/* {image ? (
                <canvas 
                    className="CaptureImg" 
                    id="TestImage"></canvas>
            ) : (
                <p>Place the object cards on the paper template and take a picture to see it here.</p>
            )} */}
            <canvas id="TestCapture"></canvas>
            <img 
                className="CameraBtn"
                src={CameraBtn}
                alt="Camera Button"
                onClick={() => setState("camera") }
            />
        </div>
    )
}

