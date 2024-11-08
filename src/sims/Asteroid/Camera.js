import Webcam from "react-webcam";
import { useState, useRef, useCallback, useEffect } from "react";

import { findMarkers } from "../../utils/CVUtils";
import { checkMarkers } from "./SimUtils";

import { BottombarCapture } from "../../ui/Bottombar";

import CheckImg from "../../images/check-mark.svg";
import CaptureBtn from '../../images/capture-btn.svg';

const VideoConstraints = {
    width: 1080,
    height: 720,
    facingMode: "user"
  };
  
export function CameraPage({setState, capture, setCapture}) {
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

            let markersFound = checkMarkers(img);
            setValidFrame(markersFound);

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
        if (webcamRef == null) {
            console.log("Not declared yet");
            return;
        }

        const video = webcamRef.current.video;
        const canvas = canvasRef.current;

        // const capture = captureRef.current;

        // THE CAPTUREREF IS NULL, PROBABLY BECAUSE THE ASSOCIATED CANVAS IS NOT CREATED IN CAMERA PAGE
        // console.log(canvasRef);
        // console.log(captureRef);

        if (video && canvas) {
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const img = cv.matFromImageData(frame);
            const gray = new cv.Mat();
            cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);

            // let markersFound = checkMarkers(img);
            // setValidFrame(markersFound);

            // cv.imshow(capture, gray);

            // Delete old capture
            if (capture !== null)
                capture.delete();

            setCapture(gray);

            img.delete();
            // gray.delete();

            setState("home");
        }
    }, []);
    
    return (
        <div className="CameraPreview">
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
            <Bottombar onClick={() => {captureFrame();}} valid={validFrame} />
        </div>
    )
}

function Bottombar({onClick, valid}) {
    return (
        <div className="Bottombar">
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

