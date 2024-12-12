import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./styling/create-expense-form.css";
import { AppContext } from "../AppContext";
import { fetchGroupMembers } from "../api/groupApi";
import { createExpense } from "../api/expenseApi";

function CreateExpenseForm() {
  const { groups } = useContext(AppContext);
  const [useExistingGroup, setUseExistingGroup] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({ Me: true });
  const [expenseTotal, setExpenseTotal] = useState("");
  const [description, setDescription] = useState("");
  const [paidBy, setPaidBy] = useState("Me");
  const [splitMethod, setSplitMethod] = useState("Equally");
  const [splitBetween, setSplitBetween] = useState({});
  const [calculatedPayments, setCalculatedPayments] = useState({});
  const [adjustingMember, setAdjustingMember] = useState(null);
  const [adjustmentValue, setAdjustmentValue] = useState("");

  const userApiUrl = process.env.REACT_APP_USER_SERVICE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedGroup) {
      console.log("Selected Group:", selectedGroup);

      if (selectedGroup.members) {
        const memberEmails = selectedGroup.members;

        setGroupMembers(memberEmails);
        setUsers(memberEmails);

        const initialSplit = {};
        memberEmails.forEach((email) => {
          initialSplit[email] = true;
        });
        setSplitBetween(initialSplit);

        console.log("Group Members:", memberEmails);
      }
    }
  }, [selectedGroup]);

  // update group members when specifying users
  useEffect(() => {
    if (!useExistingGroup) {
      const members = Object.keys(selectedUsers).filter(
        (user) => selectedUsers[user]
      );
      setGroupMembers(members);

      const initialSplitBetween = {};
      members.forEach((member) => {
        initialSplitBetween[member] = true;
      });
      setSplitBetween(initialSplitBetween);
    }
  }, [useExistingGroup, selectedUsers]);

  useEffect(() => {
    if (!userInput) {
      setFilteredUsers([]);
    } else {
      const filtered = users.filter((user) =>
        user.toLowerCase().includes(userInput.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [userInput, users]);

  // Calculate payments
  useEffect(() => {
    const calculatePayments = () => {
      if (!expenseTotal || !groupMembers.length) return;

      const payments = {};

      if (splitMethod === "Equally") {
        const selectedMembers = groupMembers.filter(
          (member) => splitBetween[member]
        );
        const numSelected = selectedMembers.length;

        if (numSelected > 0) {
          const amountPerPerson = parseFloat(expenseTotal) / numSelected;
          selectedMembers.forEach((member) => {
            payments[member] = amountPerPerson.toFixed(2);
          });
        }
      } else if (splitMethod === "Percentage") {
        const totalPercentage = Object.values(splitBetween).reduce(
          (acc, value) => acc + (parseFloat(value) || 0),
          0
        );

        if (totalPercentage === 100) {
          groupMembers.forEach((member) => {
            const percentage = parseFloat(splitBetween[member]) || 0;
            payments[member] = ((expenseTotal * percentage) / 100).toFixed(2);
          });
        }
      } else if (splitMethod === "Exact Amount") {
        const totalAmount = Object.values(splitBetween).reduce(
          (acc, value) => acc + (parseFloat(value) || 0),
          0
        );

        if (totalAmount === parseFloat(expenseTotal)) {
          groupMembers.forEach((member) => {
            const amount = parseFloat(splitBetween[member]) || 0;
            payments[member] = amount.toFixed(2);
          });
        }
      }

      setCalculatedPayments(payments);
    };

    calculatePayments();
  }, [expenseTotal, splitBetween, splitMethod, groupMembers]);

  const handleAdjustment = (member) => {
    setAdjustingMember(member);
    setAdjustmentValue("");
  };

  const applyAdjustment = () => {
    setCalculatedPayments((prev) => ({
      ...prev,
      [adjustingMember]: (
        parseFloat(prev[adjustingMember]) + parseFloat(adjustmentValue)
      ).toFixed(2),
    }));
    setAdjustingMember(null);
  };

  const handleAddUser = (user) => {
    setSelectedUsers((prev) => ({ ...prev, [user]: true }));
    setUserInput("");
    setFilteredUsers([]);
  };

  const handleRemoveUser = (user) => {
    if (user === "Me") return;
    setSelectedUsers((prev) => {
      const updated = { ...prev };
      delete updated[user];
      return updated;
    });
  };

  const handleSubmit = async () => {
    console.log({
      useExistingGroup,
      selectedGroup: useExistingGroup ? selectedGroup : "New Group",
      groupMembers,
      expenseTotal,
      description,
      paidBy,
      splitMethod,
      splitBetween,
      calculatedPayments,
    });

    const groupId = selectedGroup.group_id;
    if (useExistingGroup && groupId) {
      console.log("Fetching members for group:", groupId);

      try {
        const detailedMembers = await fetchGroupMembers(groupId);
        console.log("Detailed Members:", detailedMembers);

        const payer = detailedMembers.find((m) => m.email === paidBy);

        const expenseRequestPayload = {
          expense: {
            total: parseFloat(expenseTotal),
            description,
            group_id: groupId,
          },
          splits: Object.entries(splitBetween)
            .map(([email, isIncluded]) => {
              if (!isIncluded || email === paidBy) return null;
              const member = detailedMembers.find((m) => m.email === email);
              return {
                group_id: groupId,
                payer_id: payer.id,
                amount: parseFloat(calculatedPayments[email]),
                timestamp: new Date().toISOString(),
                payee_id: member.id,
                payer_confirm: false,
                payee_confirm: false,
                label: description,
              };
            })
            .filter(Boolean),
        };

        console.log("Expense Request Payload:", expenseRequestPayload);

        // Call createExpense function
        const response = await createExpense(
          expenseRequestPayload.expense,
          expenseRequestPayload.splits
        );
        console.log("Expense created successfully:", response);
        navigate("/balances");
      } catch (error) {
        console.error("Error creating expense", error);
      }
    } else if (!useExistingGroup) {
      console.log("Creating new group with users:", groupMembers);
    }
  };

  return (
    <div className="create-expenses-page">
      <div className="create-expenses-container">
        <div className="create-expense-header">Create an Expense</div>
        <div className="header-line"></div>
        <div className="create-expense-form-body">
          <div className="create-expense-form-left">
            <div className="subheader-label">Group</div>

            <div className="form-group">
              <div className="toggle-group-method">
                <button
                  className={`toggle-group-button ${
                    useExistingGroup ? "active" : ""
                  }`}
                  onClick={() => setUseExistingGroup(true)}
                >
                  Use Existing Group
                </button>
                <button
                  className={`toggle-group-button ${
                    !useExistingGroup ? "active" : ""
                  }`}
                  onClick={() => setUseExistingGroup(false)}
                >
                  Create New Group
                </button>
              </div>
            </div>

            {useExistingGroup && (
              <div className="select-group-form">
                <select
                  id="groupSelect"
                  value={selectedGroup ? selectedGroup.group_id : ""}
                  onChange={(e) => {
                    const selectedGroupId = e.target.value;
                    const group = groups.find(
                      (g) => String(g.group_id) === String(selectedGroupId)
                    );
                    setSelectedGroup(group);
                  }}
                >
                  <option value="" disabled>
                    Select Group
                  </option>
                  {groups.map((group) => (
                    <option key={group.group_id} value={group.group_id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!useExistingGroup && (
              <div className="form-group">
                <label>Specify Users:</label>
                <input
                  type="text"
                  placeholder="Start typing a name..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
                <div className="autocomplete-dropdown">
                  {filteredUsers.map((user) => (
                    <div
                      key={user}
                      className="autocomplete-item"
                      onClick={() => handleAddUser(user)}
                    >
                      {user}
                    </div>
                  ))}
                </div>

                <div className="selected-users">
                  {Object.keys(selectedUsers).map((user) => (
                    <div key={user} className="selected-user">
                      {user}{" "}
                      {user !== "Me" && (
                        <button
                          className="remove-user-button"
                          onClick={() => handleRemoveUser(user)}
                        >
                          x
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="subheader-label">Expense Total</label>
              <input
                type="number"
                placeholder="Enter total $ amount"
                value={expenseTotal}
                onChange={(e) => setExpenseTotal(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="subheader-label">Description</label>
              <input
                type="text"
                placeholder="Enter a description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="create-expense-form-right">
            <div className="form-group">
              <label className="subheader-label">Paid by:</label>
              <ul className="paid-by-list">
                {groupMembers.map((person) => (
                  <li
                    key={person}
                    className={`paid-by-item ${
                      paidBy === person ? "selected" : ""
                    }`}
                    onClick={() => setPaidBy(person)}
                  >
                    <img
                      src="/assets/images/default_profile.png"
                      alt={`${person}'s profile`}
                      className="expense-profile-icon"
                    />
                    <span className="group-member-name">{person}</span>
                    <input
                      type="radio"
                      name="paidBy"
                      value={person}
                      checked={paidBy === person}
                      onChange={() => setPaidBy(person)}
                      className="radio-input"
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="form-group">
              <label className="subheader-label">Split Method:</label>
              <div className="split-method-group">
                {["Equally", "Percentage", "Exact Amount"].map((method) => (
                  <button
                    key={method}
                    className={`split-method-btn ${
                      splitMethod === method
                        ? `${method.toLowerCase().replace(" ", "-")}-active`
                        : `${method.toLowerCase().replace(" ", "-")}-inactive`
                    }`}
                    onClick={() => setSplitMethod(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="subheader-label">Split between:</label>
              <div className="split-between-list">
                {groupMembers.map((person) => (
                  <div key={person} className="split-between-item">
                    <img
                      src="/assets/images/default_profile.png"
                      alt={`${person}'s profile`}
                      className="expense-profile-icon"
                    />
                    <div className="group-member-name">{person}</div>
                    <input
                      type="checkbox"
                      id={`splitBetween-${person}`}
                      name="splitBetween"
                      checked={splitBetween[person] || false}
                      onChange={() =>
                        setSplitBetween((prev) => ({
                          ...prev,
                          [person]: !prev[person],
                        }))
                      }
                      className="radio-input"
                    />
                  </div>
                ))}
              </div>
            </div>

            {splitMethod === "Percentage" && (
              <div className="percentage-split">
                {groupMembers.map((member) => (
                  <div key={member} className="percentage-item">
                    <div className="member-name">{member}</div>
                    <input
                      type="number"
                      className="percentage-input"
                      placeholder="%"
                      value={splitBetween[member] || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSplitBetween((prev) => ({
                          ...prev,
                          [member]: value,
                        }));
                      }}
                    />
                  </div>
                ))}
                <div className="validation-message">
                  {Object.values(splitBetween).reduce(
                    (acc, value) => acc + (parseFloat(value) || 0),
                    0
                  ) !== 100 && "Total must equal 100%"}
                </div>
              </div>
            )}

            {splitMethod === "Exact Amount" && (
              <div className="exact-amount-split">
                {groupMembers.map((member) => (
                  <div key={member} className="exact-item">
                    <div className="member-name">{member}</div>
                    <input
                      type="number"
                      className="exact-input"
                      placeholder="$"
                      value={splitBetween[member] || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSplitBetween((prev) => ({
                          ...prev,
                          [member]: value,
                        }));
                      }}
                    />
                  </div>
                ))}
                <div className="validation-message">
                  {Object.values(splitBetween).reduce(
                    (acc, value) => acc + (parseFloat(value) || 0),
                    0
                  ) !== parseFloat(expenseTotal) &&
                    "Total must equal the expense amount"}
                </div>
              </div>
            )}

            {Object.keys(calculatedPayments).length > 0 && (
              <div className="calculated-payments">
                <div className="subheader-label">Calculated Payments:</div>
                <div className="calculated-payments-list">
                  {Object.entries(calculatedPayments).map(
                    ([member, amount]) => (
                      <div key={member} className="calculated-payments-item">
                        <div className="member-name">{member}</div>
                        <div className="payment-amount">
                          ${amount}
                          <button
                            className="adjust-btn"
                            onClick={() => handleAdjustment(member)}
                          >
                            Adjust
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
            {adjustingMember && (
              <div className="adjustment-modal">
                <div>
                  Adjust payment for {adjustingMember}
                  <input
                    type="number"
                    placeholder="Enter adjustment amount"
                    value={adjustmentValue}
                    onChange={(e) => setAdjustmentValue(e.target.value)}
                  />
                  <button
                    onClick={applyAdjustment}
                    className="apply-adjust-btn"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="form-actions">
          <button
            className="cancel-button"
            onClick={() => console.log("Cancel")}
          >
            Cancel
          </button>
          <button className="create-button" onClick={handleSubmit}>
            Create Expense
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateExpenseForm;
