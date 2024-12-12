import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import Button from "./button";
import "./styling/charges-table.css";

const ChargesTable = ({ action, view }) => {
  const [charges, setCharges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedCharge, setSelectedCharge] = useState(null); // Selected charge for payment
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
      } catch (err) {
        console.error("Error fetching charges:", err);
      }
    };

    fetchCharges();
  }, []);

  // Trim charges for the 'home' view
  const displayedCharges = view === "home" ? charges.slice(0, 4) : charges;

  const handlePayClick = (charge) => {
    setSelectedCharge(charge);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCharge(null);
  };

  return (
    <div className={view === "balances" ? "scrollable-container" : ""}>
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
          {displayedCharges.length > 0 ? (
            displayedCharges.map((row, index) => (
              <tr key={index}>
                <td className="td">{row.timestamp.slice(0, 10)}</td>
                <td className="td">{row.name}</td>
                <td className="td">{row.group_name}</td>
                <td className="td">{row.amount}</td>
                <td className="td">{row.description}</td>
                <td className="td">
                  {action === "Pay" ? (
                    <Button
                      href=""
                      onClick={() => handlePayClick(row)}
                      className="charges-action-button"
                    >
                      {action}
                    </Button>
                  ) : (
                    <Button href="" className="charges-action-button">
                      {action}
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="td" colSpan="6">
                You do not have any pending {action === "Remind" ? "collections" : "payments"}.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Payment</h2>
            <p>
              Are you sure you want to pay{" "}
              <strong>{selectedCharge?.amount}</strong> for{" "}
              <strong>{selectedCharge?.reason}</strong> to{" "}
              <strong>{selectedCharge?.name}</strong>?
            </p>
            <div className="modal-actions">
              <Button onClick={closeModal} className="modal-button cancel">
                Cancel
              </Button>
              <Button onClick={() => { /* Add payment logic here */ closeModal(); }} className="modal-button confirm">
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChargesTable;
