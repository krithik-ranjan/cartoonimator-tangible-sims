import "../styles/main.css";

import PlayBtn from '../images/play-btn.svg';

import AsteroidSimInfo from '../sims/Asteroid/SimInfo.js'

import * as React from 'react';
import { useState } from "react";

// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';


export default function HomePage({image, setState}) {
  return (
    <div className="Home">
        <CapturePreview image={image} setState={setState} />
        <SimInfo />
        <BottomBar />
    </div>
  );
}

function SimInfo() {
    return (
        <AsteroidSimInfo />
    )
}

function BottomBar() {
    return (
        <div className="BottomBar">
            <img 
                className="PlayBtn"
                src={PlayBtn}
                alt="Play Button"
            />
        </div>
    )
}
