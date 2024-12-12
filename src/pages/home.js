import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Header from "../components/header";
import HomeSignedChild from "../components/home-signed-in";
import HomeDefault from "../components/default_home";
import "../styling/home.css";

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <div className="home-container">
      <Header />
      {isAuthenticated ? (
        <HomeSignedChild />
      ) : (
        <HomeDefault/>
      )}
    </div>
  );
}

export default Home;
