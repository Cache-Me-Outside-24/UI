import React, { useState, useEffect } from "react";
import "../styling/create-expense.css";

function CreateExpenseForm() {
  const [useExistingGroup, setUseExistingGroup] = useState(true);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedUsers, setSelectedUsers] = useState({ Me: true });
  const [expenseTotal, setExpenseTotal] = useState("");
  const [description, setDescription] = useState("");
  const [paidBy, setPaidBy] = useState("Me");
  const [splitMethod, setSplitMethod] = useState("Equally");
  const [splitBetween, setSplitBetween] = useState({});
  const [groupMembers, setGroupMembers] = useState([]);
  const [calculatedPayments, setCalculatedPayments] = useState({});

  // mock fetching groups and users
  useEffect(() => {
    // TODO: replace mock groups with fetch group api call

    const mockGroups = [
      { group_id: "Group1", name: "Friends" },
      { group_id: "Group2", name: "Family" },
    ];
    const mockUsers = ["Me", "Maria Clague", "Kate Osorio", "John Doe"];

    setGroups(mockGroups);
    setUsers(mockUsers);
  }, []);

  // update group members when an existing group is selected
  useEffect(() => {
    if (useExistingGroup && selectedGroup) {
      // TODO: replace with fetch groups call
      const mockMembers = {
        Group1: ["Me", "Maria Clague", "Kate Osorio"],
        Group2: ["Me", "John Doe", "Jane Smith"],
      };

      const members = mockMembers[selectedGroup] || [];
      setGroupMembers(members);

      const initialSplitBetween = {};
      members.forEach((member) => {
        initialSplitBetween[member] = true;
      });
      setSplitBetween(initialSplitBetween);
    }
  }, [useExistingGroup, selectedGroup]);

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

      const selectedMembers = groupMembers.filter(
        (member) => splitBetween[member]
      );
      const numSelected = selectedMembers.length;

      if (numSelected === 0) return;

      const payments = {};

      if (splitMethod === "Equally") {
        const amountPerPerson = parseFloat(expenseTotal) / numSelected;
        selectedMembers.forEach((member) => {
          payments[member] = amountPerPerson.toFixed(2);
        });
      }

      setCalculatedPayments(payments);
    };

    calculatePayments();
  }, [expenseTotal, splitBetween, splitMethod, groupMembers]);

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

  const handleSubmit = () => {
    console.log("Form Submitted!");
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

    // TODO: replace with API call for creating a group if using specified users
    if (!useExistingGroup) {
      console.log("Creating new group with users:", groupMembers);
    }
  };

  return (
    <div className="create-expenses-page">
      <div className="create-expenses-container">
        <h1>Create an Expense</h1>

        <div className="form-group">
          <label>Choose Method:</label>
          <div className="toggle-group">
            <button
              className={`toggle-button ${useExistingGroup ? "active" : ""}`}
              onClick={() => setUseExistingGroup(true)}
            >
              Existing Group
            </button>
            <button
              className={`toggle-button ${!useExistingGroup ? "active" : ""}`}
              onClick={() => setUseExistingGroup(false)}
            >
              Specify Users
            </button>
          </div>
        </div>

        {useExistingGroup ? (
          <div className="form-group">
            <label>Group</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group.group_id} value={group.group_id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
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

        {groupMembers.length > 0 && (
          <>
            <div className="form-group">
              <label>Expense Total</label>
              <input
                type="number"
                placeholder="Enter total $ amount"
                value={expenseTotal}
                onChange={(e) => setExpenseTotal(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                placeholder="Enter a description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Paid by:</label>
              <div className="radio-group">
                {groupMembers.map((person) => (
                  <div key={person} className="radio-item">
                    <input
                      type="radio"
                      id={`paidBy-${person}`}
                      name="paidBy"
                      value={person}
                      checked={paidBy === person}
                      onChange={() => setPaidBy(person)}
                    />
                    <label htmlFor={`paidBy-${person}`}>{person}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Split Method:</label>
              <div className="split-method-group">
                {["Equally", "Percentage", "Exact Amount", "Adjustment"].map(
                  (method) => (
                    <button
                      key={method}
                      className={`split-method ${
                        splitMethod === method ? "selected" : ""
                      }`}
                      onClick={() => setSplitMethod(method)}
                    >
                      {method}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Split between:</label>
              <div className="checkbox-group">
                {groupMembers.map((person) => (
                  <div key={person} className="checkbox-item">
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
                    />
                    <label htmlFor={`splitBetween-${person}`}>{person}</label>
                  </div>
                ))}
              </div>
            </div>

            {Object.keys(calculatedPayments).length > 0 && (
              <div className="calculated-payments">
                <h4>Calculated Payments:</h4>
                <ul>
                  {Object.entries(calculatedPayments).map(
                    ([member, amount]) => (
                      <li key={member}>
                        {member}: ${amount}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </>
        )}

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
