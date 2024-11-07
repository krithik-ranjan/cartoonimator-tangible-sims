import PlayBtn from '../images/play-btn.svg';
import CaptureBtn from '../images/capture-btn.svg';

export function BottombarHome() {
    return (
        <div className="Bottombar">
            <img 
                className="PlayBtn"
                src={PlayBtn}
                alt="Play Button"
            />
        </div>
    )
}

export function BottombarCapture({onClick}) {
    return (
        <div className="Bottombar">
            <img 
                className="CaptureBtn"
                src={CaptureBtn}
                alt="Capture Button"
                onClick={() => {onClick()}}
            />
        </div>
    )
}