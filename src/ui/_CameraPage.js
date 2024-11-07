import "../styles/main.css";

import { processImage } from "../utils/_test";


import * as React from 'react';
import { useState, useRef, useCallback } from "react";

export default function CameraPage({setState, setImage}) {
    const webcamRef = useRef(null);
    const [capture, setCapture] = useState(null);

    const captureFrame = useCallback(() => {
        const image = webcamRef.current.getScreenshot();
        setCapture(image);

        processImage("ImageCapture");

        // setImage(image);
        setState("home");
        console.log("Capturing");
    }, [webcamRef]);

    return (
      <div className="Camera">
            <CameraPreview webcamRef={webcamRef}/>
            <BottomBar onClick={captureFrame} />
      </div>
    );
  }



function BottomBar({onClick}) {
    return (
        <div className="BottomBar">
            <img 
                className="CaptureBtn"
                src={CaptureBtn}
                alt="Capture Button"
                onClick={() => {onClick()}}
            />
        </div>
    )
}