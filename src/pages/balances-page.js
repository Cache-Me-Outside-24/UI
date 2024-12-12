import React, { useState } from "react";
import Header from "../components/header";
import BalancesContainer from "../components/balances";
import "../styling/login.css";

function Balances() {
  return (
    <div className="balances-page">
      <Header />
      <BalancesContainer/>
    </div>
  );
}

export default Balances;
