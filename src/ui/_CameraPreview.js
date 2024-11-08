import Webcam from "react-webcam";

import { useState, useRef, useCallback, useEffect } from "react";

const VideoConstraints = {
    width: 1080,
    height: 640,
    facingMode: "user"
  };
  
export function CameraPreview() {
    const webcamRef = useRef(null);
    const captureRef = useRef(null);
    
    const processFrame = useCallback(() => {
        if (webcamRef == null) {
            console.log("Not declared yet");
            return;
        }

        const video = webcamRef.current.video;
        const canvas = captureRef.current;

        if (video && canvas) {
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const src = cv.matFromImageData(frame);
            const dst = new cv.Mat();

            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
            cv.imshow(canvas, dst);

            src.delete();
            dst.delete();
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(processFrame, 30);
        return () => clearInterval(interval);
    }, [processFrame]);
    
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
                ref={captureRef}
                width={1080}
                height={640}
            />
        </div>
)
}