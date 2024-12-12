import React, { useState } from "react";
import "./styling/balances-container.css";
import ChargesTable from "./charges-table";
import { useAuth } from "../AuthContext";

function BalancesContainer() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("collect");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="balance-container">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "collect" ? "active" : ""}`}
          onClick={() => handleTabClick("collect")}
        >
          Collect
        </button>
        <button
          className={`tab ${activeTab === "pay" ? "active" : ""}`}
          onClick={() => handleTabClick("pay")}
        >
          Pay
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "collect" && (
          <ChargesTable
            action="Remind"
            view="balances"
          />
        )}
        {activeTab === "pay" && (
          <ChargesTable
            action="Pay"
            view="balances"
          />
        )}
      </div>
    </div>
  );
}

export default BalancesContainer;
