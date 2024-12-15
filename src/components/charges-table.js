import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import Button from "./button";
import "./styling/charges-table.css";

const ChargesTable = ({ action, view }) => {
  const [charges, setCharges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedCharge, setSelectedCharge] = useState(null); // Selected charge for payment
  const [paymentMethod, setPaymentMethod] = useState(""); // User-entered payment method
  const apiURL = process.env.REACT_APP_EXPENSE_SERVICE_API_BASE_URL;
  const messageURL = process.env.REACT_APP_EMAIL_REMINDER_TRIGGER_URL;
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
        console.log(data);
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
    setPaymentMethod("");
  };

  const handleConfirmPayment = async () => {
    try {
      const payload = {
        amount_owed: selectedCharge.amount,
        paid: false, // Set to false initially
        method: paymentMethod, // User-entered method
      };

      const response = await fetch(
        `${apiURL}/expenses/${selectedCharge.expense_id}/payments/${user.uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update payment");
      }

      console.log("Payment updated successfully!");
      closeModal();
    } catch (err) {
      console.error("Error confirming payment:", err);
    }
  };

  const sendReminder = async (charge) => {
    const reminderPayload = {
      toUser: { email: charge.email, name: charge.name },
      fromUser: { email: user.email, name: user.displayName },
      expense: charge.amount,
      groupName: charge.group_name,
      description: charge.description,
    };

    try {
      console.log();
      console.log("SENDINING REMINDER: ", reminderPayload);
      const response = await fetch(messageURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reminderPayload),
      });

      if (response.ok) {
        const data = await response.text();
        console.log("Reminder sent successfully:", data);
        alert("Reminder email sent!");
      } else {
        const error = await response.text();
        console.error("Error sending reminder:", error);
        alert("Failed to send the reminder.");
      }
    } catch (err) {
      console.error("Request error:", err);
      alert("An error occurred while sending the reminder.");
    }
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
                    <button
                      href=""
                      onClick={row.confirm ? null : () => handlePayClick(row)}
                      className="charges-action-button"
                    >
                      {action}
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        row.confirm
                          ? handleConfirm(row)
                          : action === "Remind" && sendReminder(row)
                      }
                      className="charges-action-button"
                    >
                      {action}
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="td" colSpan="6">
                You do not have any pending{" "}
                {action === "Remind" ? "collections" : "payments"}.
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
            <label className="modal-label">
              Method of Payment:
              <input
                type="text"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                placeholder="e.g., Credit Card, Bank Transfer"
                className="modal-input"
              />
            </label>
            <div className="modal-actions">
              <Button onClick={closeModal} className="modal-button cancel">
                Cancel
              </Button>
              <Button
                onClick={handleConfirmPayment}
                className="modal-button confirm"
                disabled={!paymentMethod}
              >
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
