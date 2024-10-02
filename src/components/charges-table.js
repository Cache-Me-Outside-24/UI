import React, { useState, useEffect } from 'react';
import './charges-table.css'; 

const ChargesTable = ({ action }) => {
  const [charges, setCharges] = useState([]);

  useEffect(() => {
    const fetchCharges = async () => {
      //  REPLACE WITH API CALL
      const simulatedData = [
        { date_posted: '09/22/2024', group: 'cache-me-outside', name: 'John Doe', amount: '$43', reason: 'Dinner' },
        { date_posted: '09/19/2024', group: 'cache-me-outside', name: 'John Doe', amount: '$7', reason: 'Lunch' },
        { date_posted: '09/19/2024', group: 'cache-me-outside', name: 'John Doe', amount: '$13', reason: 'Lunch' },
      ];
      setCharges(simulatedData);
    };

    fetchCharges();
  }, []);

  return (
    <table className="table">
      <thead className="thead">
        <tr>
          <th className="th">Date Posted</th>
          <th className="th">Name</th>
          <th className='th'>Group</th>
          <th className="th">Amount</th>
          <th className="th">Reason</th>
          <th className='th'></th>
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
            <td className='td'>{action}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ChargesTable;
