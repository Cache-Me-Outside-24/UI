import React, { useState, useEffect } from "react";
import "./styling/charges-table.css";
import { useAuth } from "../AuthContext";

const ChargesTable = ({ action }) => {
  const [charges, setCharges] = useState([]);
  const apiURL = process.env.REACT_APP_EXPENSE_SERVICE_API_BASE_URL;
  const { user } = useAuth();
  useEffect(() => {
    const fetchCharges = async () => {
      try {
        const response = await fetch(
          `${apiURL}/expenses/${action === "Remind" ? "payee" : "payer"}/${
            user.uid
          }`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch expenses");
        }

        const data = await response.json();
        setCharges(data);
      } catch (err) {}
    };

    fetchCharges();
  }, []);

  return (
    <table className="table">
      <thead className="thead">
        <tr>
          <th className="th">Date Posted</th>
          <th className="th">Name</th>
          <th className="th">Group</th>
          <th className="th">Amount</th>
          <th className="th">Reason</th>
          <th className="th">Action</th>
        </tr>
      </thead>
      <tbody>
        {charges.map((row, index) => (
          <tr key={index}>
            <td className="td">{row.date_posted}</td>
            <td className="td">{row.name}</td>
            <td className="td">{row.group}</td>
            <td className="td">{row.amount}</td>
            <td className="td">{row.reason}</td>
            <td className="td">{action}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ChargesTable;
