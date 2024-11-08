import * as React from 'react';
import { useState, useRef, useCallback, useEffect } from "react";

import { Titlebar } from '../../ui/Titlebar';
import { AsteroidSimInfo } from './SimInfo';
import { BottombarHome, BottombarCapture } from '../../ui/Bottombar';
// import { CameraPreview } from '../../ui/CameraPreview';
import { CameraPage } from './Camera';

// import processCapture from '../../utils/CVUtils';

import CameraBtn from '../../images/camera-btn.svg';

export default function AsteroidSim() {
    const [pageState, setPageState] = useState("home");

    // const backgroundRef = useRef(null);
    const [bgCapture, setBgCapture] = useState(null);

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
                    <AsteroidSimInfo />
                    <CapturePreview setState={setPageState} bgCapture={bgCapture} />
                </div>
                <BottombarHome />
            </div>
        )
    } 
    else if (pageState === "camera") {
        return (
            <div className="App">
                <Titlebar /> 
                <CameraPage setState={setPageState} capture={bgCapture} setCapture={setBgCapture}/>

                {/* <div className="Camera">
                    <CameraPreview />
                    <img id="ImageCapture" src={capture} width={1080} height={640}/>
                    <canvas id="TestCapture" width={1080} height={640} />
                </div> */}
                {/* <BottombarCapture onClick={() => {}}/> */}
            </div>
        )
    } 
}

function CapturePreview({setState, bgCapture}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (bgCapture == null) 
            return;

        console.log("Showing capture on canvas, size: ");
        console.log(bgCapture.size());

        // Resize before showing on canvas
        let temp = new cv.Mat();
        let dsize = new cv.Size(480, 320);
        cv.resize(bgCapture, temp, dsize, 0, 0, cv.INTER_AREA);

        const canvas = canvasRef.current;
        cv.imshow(canvas, temp);

        temp.delete();
    }, []);

    return (
        <div className="PreviewPane">
            <h3>Background</h3>
            <div className="CapturePreview">
                <canvas 
                    ref={canvasRef}
                    width={480}
                    height={320} />
                <img 
                    className="CameraBtn"
                    src={CameraBtn}
                    alt="Camera Button"
                    onClick={() => setState("camera") }
                />
            </div>
            <h3>Objects</h3>
            <div className="CapturePreview">
                <canvas 
                    width={480}
                    height={320} />
                <img 
                    className="CameraBtn"
                    src={CameraBtn}
                    alt="Camera Button"
                    onClick={() => setState("camera") }
                />
            </div>
            
        </div>
    )
}

