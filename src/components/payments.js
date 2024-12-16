import React, { useState, useEffect } from "react";
import "./styling/balances-container.css";
import { useAuth } from "../AuthContext";

function PaymentsContainer() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const graphqlEndpoint = `${process.env.REACT_APP_EXPENSE_SERVICE_API_BASE_URL}/graphql`; // Replace with your endpoint

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);

      const query = `
        query GetPayments($userId: String!) {
          payments(userId: $userId) {
            groupName
            payerId
            amountOwed
            paid
            payeeName
          }
        }
      `;

      const variables = {
        userId: user.uid, // Use the logged-in user's ID
      };

      try {
        const response = await fetch(graphqlEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, variables }),
        });

        const { data, errors } = await response.json();

        if (errors) {
          console.error("GraphQL errors:", errors);
          setError("Failed to fetch payments");
        } else {
          setPayments(data.payments);
        }
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user.uid]);

  return (
    <div className="scrollable-container">
      <h2>Payments</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && payments.length > 0 ? (
        <table className="table">
          <thead className="thead">
            <tr>
              <th className="th">Group</th>
              <th className="th">Name</th>
              <th className="th">Amount</th>
              <th className="th">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index}>
                <td className="td">{payment.groupName}</td>
                <td className="td">{payment.payeeName}</td>
                <td className="td">${payment.amountOwed.toFixed(2)}</td>
                <td className="td">{payment.paid ? "Paid" : "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No payments found.</p>
      )}
    </div>
  );
}

export default PaymentsContainer;
