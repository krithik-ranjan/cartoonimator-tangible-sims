import Webcam from "react-webcam";
import { useState, useRef, useCallback, useEffect } from "react";

import { findMarkers, flattenFrame } from "../../utils/CVUtils";
import { AsteroidSimulation } from "./SimUtils";

import { BottombarCapture } from "../../ui/Bottombar";

import CheckImg from "../../images/check-mark.svg";
import CaptureBtn from "../../images/capture-btn.svg";
import BackBtn from "../../images/back-btn.svg";

// const VideoConstraints = {
//     width: 1080,
//     height: 720,
//     // facingMode: { exact: "environment" }
//     deviceId: "128849aa6d8fc61174b05c1d415cd982031daa69703c92d872b4dd325014aa6f"
// };
  
export function CameraPage({setState, simData}) {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const [validFrame, setValidFrame] = useState(false);
    const [lastValidTime, setLastValidTime] = useState(Date.now() % 100000);

    const [selectedCameraId, setSelectedCameraId] = useState("");
    
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

            if (markersFound) {
                setLastValidTime(Date.now() % 100000);
                setValidFrame(true);
            } else {
                if (Date.now() > lastValidTime + 2000) {
                    setValidFrame(false);
                }
                else {
                    setValidFrame(true);
                }
            }
            // console.log(lastValidTime);

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
                videoConstraints={{
                    width: 1080,
                    height: 720,
                    deviceId: selectedCameraId
                }} 
                ref={webcamRef}
            />
            <canvas 
                ref={canvasRef}
                width={1080}
                height={720}
                style={{display: "none"}}
            />
            <CameraCheck check={validFrame} />
            <Bottombar onClick={() => {captureFrame()}} onBack={() => {setState("home")}} valid={validFrame} setCamera={setSelectedCameraId} />
        </div>
    )
}

function Bottombar({onClick, onBack, valid, setCamera}) {
    const [devices, setDevices] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState("");
    
    useEffect(() => {
        const getDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === "videoinput");
                setDevices(videoDevices);

                // Set default camera to the first device
                if (videoDevices.length > 0) {
                    setCamera(videoDevices[0].deviceId);
                    setSelectedCamera(videoDevices[0].deviceId);
                }
            } catch (err) {
                console.error("Error accessing devices: ", err);
            }
        };

        getDevices();
    }, []);

    const handleDeviceChange = (event) => {
        console.log(`Setting camera to: ${event.target.value}`);
        setCamera(event.target.value); 
        setSelectedCamera(event.target.value);
    }

    // const cameraList = devices.length > 0 ? devices.map((dev) => <li>{dev.label}</li>) : <li>None</li>;
    const cameraList = devices.length > 0 ? devices.map((dev) => 
        <option key={dev.deviceId} value={dev.deviceId}>{dev.label}</option>) : 
        (<option disabled>Loading...</option>)

    return (
        <div className="Bottombar">
            <img 
                className="BackBtn"
                src={BackBtn}
                alt="Back Button"
                onClick={() => {onBack()}}
            />
            <div className="BottomOptions">
                <label>Camera: </label>
                <select value={selectedCamera} onChange={handleDeviceChange}>
                    {cameraList}
                </select>
            </div>
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

