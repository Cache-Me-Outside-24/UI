import React, { useState } from "react";
import Header from "../components/header";
import HomeSignedChild from "../components/home-signed-in";
import "../styling/home.css";

function Home() {
  const [isSignedIn] = useState(true);

  return (
    <div className="home-container">
      <Header />

      <HomeSignedChild />
    </div>
  );
}

export default Home;
