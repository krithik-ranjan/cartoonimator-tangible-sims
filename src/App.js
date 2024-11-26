import "./styles/main.css";
import "./styles/mobile.css";

import AsteroidSim from "./sims/Asteroid/SimMain.js";

import * as React from 'react';
import { useState } from "react";

export default function App() {
    return (
        <>
            <AsteroidSim />
        </>
    )
    
}


