import React, { useState } from "react";
import Header from "../components/header";
import PaymentsContainer from "../components/payments";
import "../styling/login.css";

function Payments() {
  return (
    <div className="balances-page">
      <Header />
      <PaymentsContainer />
    </div>
  );
}

export default Payments;
