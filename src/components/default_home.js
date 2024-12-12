import React from "react";
import "./styling/default_home.css";
import Button from "./button";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function HomeDefault() {
  return (
    <div className="home-content-default">
      <div className="left-home-content">
        <h1>Cut bills, not ties</h1>
        <h2>Track shared expenses, split costs fairly, and settle up instantly—all in one place.</h2>
      </div>
      <div className="right-home-content">
        <div className="demo-box">
            DEMO GOES HERE
        </div>
      </div>
    </div>
  );
}

export default HomeDefault;
