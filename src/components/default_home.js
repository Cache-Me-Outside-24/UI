import React from "react";
import "./styling/default_home.css";
import Button from "./button";

function HomeDefault() {
  return (
    <div className="home-content-default">
      <div className="left-home-content">
        <h1>Cut bills, not ties</h1>
        <h2>
          Track shared expenses, split costs fairly, and settle up instantly—all
          in one place.
        </h2>
      </div>
      <div className="right-home-content">
        <div className="demo-box">
          <video
            className="demo-video"
            src="/assets/demo_vid.mov"
            controls
            autoPlay
            loop
            muted
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}

export default HomeDefault;
