import { useCallback, useEffect, useRef, useState } from "react";

import BackBtn from "../../images/back-btn.svg";
import ReplayBtn from "../../images/replay-btn.svg";
import DownloadBtn from "../../images/download-btn.svg";

export function PlayPage({setState, simData}) {
    const canvasRef = useRef(null);
    const [playCanvas, setPlayCanvas] = useState(null);

    // const animateFrame = useCallback(() => {
    //     const canvas = canvasRef.current;

    //     if (canvas) {
    //         // Call animation functions
    //         console.log("Animating");
    //     }
    // }, []);

    // useEffect(() => {
    //     const interval = setInterval(animateFrame, 30);
    //     return () => clearInterval(interval);
    // }, [animateFrame]);

    const playAnimation = (frameCount) => {
        // Dummy animation, uncomment to see
        // let ctx = playCanvas.getContext("2d");

        // ctx.clearRect(0, 0, playCanvas.width, playCanvas.height);
        // ctx.fillStyle = "#000000";
        // ctx.beginPath();
        // ctx.arc(100, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
        // ctx.fill();

        simData.animateOrbit(playCanvas, frameCount, 1080, 720);
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
            <Bottombar onDownload={() => {}} onBack={() => {setState("home")}}/>
        </div>
    )
}

function Bottombar({onDownload, onBack}) {
    return (
        <div className="Bottombar">
            <img 
                className="BackBtn"
                src={BackBtn}
                alt="Back Button"
                onClick={() => {onBack()}}
            />
            <img 
                className="DownloadBtn"
                src={DownloadBtn}
                alt="Download Button"
                onClick={() => {onDownload()}}
            />
        </div>
    )
}