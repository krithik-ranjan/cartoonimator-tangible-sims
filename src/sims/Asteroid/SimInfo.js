import SunImg from '../../images/asteroid-sun.png';
import AsteroidImg from '../../images/asteroid-asteroid.png';
import FocusImg from '../../images/asteroid-focus.png';

import * as React from 'react';
import { useState } from "react";


export function AsteroidSimInfo() {
    const [selectedImg, setSelectedImage] = useState("");

    return (
      <div className="SimInfo">
          <h1>Asteroid Orbits</h1>
          <p>Draw your sun and asteroid and simulate the asteroid's path around the sun by placing the cards on the background and capturing with the app.</p>
          <ObjectInfo selectedImg={selectedImg} setSelectedImage={setSelectedImage} />
          <ImageDesc selectedImg={selectedImg} />
          <p>First, capture your space background by clicking the camera button. Then, place your objects on the background and capture again.</p>
      </div>
    );
}

function ObjectInfo({selectedImg, setSelectedImage}) {
    return (
        <div className="ObjectInfo">
            <ObjectImage
                image = {SunImg}
                name = "Sun"
                active = {(selectedImg === "sun")}
                onClick = {() => selectedImg === "sun" ? setSelectedImage("") : setSelectedImage("sun")}
            />
            <ObjectImage
                image = {AsteroidImg}
                name = "Asteroid"
                active = {(selectedImg === "asteroid")}
                onClick = {() => selectedImg === "asteroid" ? setSelectedImage("") : setSelectedImage("asteroid")}
            />
            <ObjectImage
                image = {FocusImg}
                name = "Focus"
                active = {(selectedImg === "focus")}
                onClick = {() => selectedImg === "focus" ? setSelectedImage("") : setSelectedImage("focus")}
            />
        </div>
    )
}

function ObjectImage({ image, name, active, onClick }) {
    return (
        <div className="ObjectImage" onClick={onClick}>
            <img 
                src={image}
                alt={name}
                width={80}
                height={80}

            />
            <p>{name}</p>
            { active && <hr></hr> }
        </div>
    )
}

function ImageDesc({ selectedImg }) {
    if (selectedImg == "sun") {
        return (
            <div className="ImageDesc">
                <p><strong>Sun:</strong> The big celestial body around which the asteroid revolves.</p>
            </div>
        );
    } 
    else if (selectedImg == "asteroid") {
        return (
            <div className="ImageDesc">
                <p><strong>Asteroid:</strong> The small rock which gets attracted by the sun's gravity and revolves around it.</p>
            </div>
        );
    }
    else if (selectedImg == "focus") {
        return (
            <div className="ImageDesc">
                <p><strong>Focus:</strong> The second focus of the asteroid’s elliptical orbit (first is the sun).</p>
            </div>
        );
    }
    else {
        return null
    }
}