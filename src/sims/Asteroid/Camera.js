import Webcam from "react-webcam";
import { useState, useRef, useCallback, useEffect } from "react";

import { findMarkers, flattenFrame } from "../../utils/CVUtils";
import { AsteroidSimulation } from "./SimUtils";

import { BottombarCapture } from "../../ui/Bottombar";

import CheckImg from "../../images/check-mark.svg";
import CaptureBtn from "../../images/capture-btn.svg";
import BackBtn from "../../images/back-btn.svg";

const VideoConstraints = {
    width: 1080,
    height: 720,
    facingMode: { exact: "user" }
    // deviceId: "e3a49304cc65499adafe09657185cded53330602da2c058895bed2d1b70411fb"
};
  
export function CameraPage({setState, simData}) {
    const handleDevices = useCallback(
        mediaDevices => 
            console.log(mediaDevices),
        []
    );

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
    }, [handleDevices]);


    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const [validFrame, setValidFrame] = useState(false);
    
    const processFrame = useCallback(() => {
        if (webcamRef == null) {
            console.log("Not declared yet");
            return;
        }

        const video = webcamRef.current.video;
        const canvas = canvasRef.current;

        if (video && canvas) {
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const img = cv.matFromImageData(frame);
            // const gray = new cv.Mat();
            // cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);

            let markers = new Map();
            let markersFound = false;
            if (simData.getState() === "bg-camera") 
                markersFound = simData.checkBgMarkers(img, markers);
            else if (simData.getState() === "obj-camera")
                markersFound = simData.checkObjMarkers(img, markers);
            setValidFrame(markersFound);

            // console.log(`Valid: ${validFrame}`);

            // cv.imshow(canvas, gray);

            img.delete();
            // gray.delete();
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(processFrame, 30);
        return () => clearInterval(interval);
    }, [processFrame]);

    const captureFrame = useCallback(() => {
        console.log("Capturing frame");

        // Take the last valid captured image and flatten it
        // Add background and objects based on the capture mode\
        if (simData.getState() === "bg-camera")
            simData.addBackground();
        else if (simData.getState() === "obj-camera")
            simData.addObjects();

        setState("home");
    }, []);
    
    return (
        <div className="CameraPage">
            <Webcam 
                className="Webcam"
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={VideoConstraints} 
                ref={webcamRef}
            />
            <canvas 
                ref={canvasRef}
                width={1080}
                height={720}
                style={{display: "none"}}
            />
            <CameraCheck check={validFrame} />
            <Bottombar onClick={() => {captureFrame()}} onBack={() => {setState("home")}} valid={validFrame} />
        </div>
    )
}

function Bottombar({onClick, onBack, valid}) {
    return (
        <div className="Bottombar">
            <img 
                className="BackBtn"
                src={BackBtn}
                alt="Back Button"
                onClick={() => {onBack()}}
            />
            {valid ? 
                <img 
                    className="CaptureBtn"
                    src={CaptureBtn}
                    alt="Capture Button"
                    onClick={() => {onClick()}}
                    style={{opacity: "1.0"}}
                /> : 
                <img 
                    className="CaptureBtn"
                    src={CaptureBtn}
                    alt="Capture Button"
                    onClick={() => {}}
                    style={{opacity: "0.2"}}
                />
            }
        </div>
    )
}

function CameraCheck({check}) {
    return (
        <>
            {check ? <img 
                className="CheckImg"
                src={CheckImg}
                alt="Checkmark"
            /> : null } 
        </>
    )
}

