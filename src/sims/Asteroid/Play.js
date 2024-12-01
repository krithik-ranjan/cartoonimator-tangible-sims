import { useCallback, useEffect, useRef, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import Whammy from "react-whammy";

import BackBtn from "../../images/back-btn.svg";
import ReplayBtn from "../../images/replay-btn.svg";
import DownloadBtn from "../../images/download-btn.svg";
import FormControlLabel from '@mui/material/FormControlLabel';

export function PlayPage({setState, simData}) {
    const canvasRef = useRef(null);
    const [playCanvas, setPlayCanvas] = useState(null);

    // state for orbit toggle
    const [checked, setChecked] = useState(true);
    const [recording, setRecording] = useState(false);

    const playAnimation = (frameCount) => { 
        simData.animateOrbit(playCanvas, frameCount, 1080, 720, checked);
    }

    const downloadAnimation = () => {
        if (recording) return;
        setRecording(true);

        const duration = 5000; // 5 seconds
        const fps = 24;
        const frameInterval = 1000 / fps;
        const totalFrames = Math.round((duration / 1000) * fps);

        let currentFrame = 0;

        const encoder = new Whammy.Video(fps); // 30 FPS

        let startTime = performance.now();

        const captureFrame = () => {
            const elapsed = performance.now() - startTime;
            // Capture current frame
            encoder.add(playCanvas);
            currentFrame++;
            // console.log('Capturing frame');

            if (currentFrame < totalFrames) {
                setTimeout(captureFrame, frameInterval);
            } else {
                // console.log(`Stopped after ${currentFrame} frames`)

                // Stop recording and generate video
                const videoBlob = encoder.compile(false, (output) => {
                    const url = URL.createObjectURL(output);

                    // Trigger download
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'animation.webm';
                    a.click();

                    URL.revokeObjectURL(url);
                    setRecording(false);
                });
            }
        }; 

        captureFrame();
    }

    useEffect(() => {
        if (canvasRef.current) {
            setPlayCanvas(canvasRef.current);
        }
    }, []);

    useEffect(() => {
        let frameCount = 0;
        let animationFrameId;

        if (playCanvas) {
            const render = () => {
                frameCount++;
                playAnimation(frameCount)
                animationFrameId = window.requestAnimationFrame(render);
            };
            render();
        }
        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [playAnimation, playCanvas]);

    return (
        <div className="PlayPage">
            <canvas 
                className="PlayCanvas"
                ref={canvasRef}
                width={1080}
                height={720}
            />
            <Bottombar onDownload={downloadAnimation} downloadValid={!recording} onBack={() => {setState("home")}} setState={setChecked}/>
        </div>
    )
}

function Bottombar({onDownload, downloadValid, onBack, setState}) {
    return (
        <div className="Bottombar">
            <img 
                className="BackBtn"
                src={BackBtn}
                alt="Back Button"
                onClick={onBack}
            />
            { downloadValid ? 
                <img 
                    className="DownloadBtn"
                    src={DownloadBtn}
                    alt="Download Button"
                    onClick={onDownload}
                    style={{opacity: "1.0"}}
                /> :
                <img 
                    className="DownloadBtn"
                    src={DownloadBtn}
                    alt="Download Button"
                    onClick={() => {}}
                    style={{opacity: "0.2"}}
                />
            }
            <FormControlLabel 
                className="OrbitBtn"
                control={<Checkbox defaultChecked />} 
                label="ORBIT PATH"
                onChange={(event) => {
                    setState(event.target.checked);
                }}
                sx={{
                    '& .MuiFormControlLabel-label': { fontFamily: 'IBM PLex Sans', fontSize: '18px', fontWeight: 500},
                }}
            />
        </div>
    )
}