import React, { useState } from 'react';
import './groups-preview.css'; 

function GroupsPreview() {
  const [groups, setGroups] = useState([
    { name: 'Cache-Me-Outside', members: ['John Doe', 'Jane Doe'] }
  ]);
  const [showModal, setShowModal] = useState(false); 
  const [newGroupName, setNewGroupName] = useState(''); 
  const [newMembers, setNewMembers] = useState(''); 

  const handleAddGroupClick = () => {
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const membersArray = newMembers.split(',').map(member => member.trim());
    
    console.log('Submitting group:', newGroupName, 'with members:', membersArray);

    setGroups([...groups, { name: newGroupName, members: membersArray }]);

    setNewGroupName('');
    setNewMembers('');
    setShowModal(false);
  };

  return (
    <div className="groups-preview-container">
      <button className="add-group-button" onClick={handleAddGroupClick}>Add Group</button>

      <table className="table">
        <thead className="thead">
          <tr>
            <th className="th">Group Name</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, index) => (
            <tr key={index}>
              <td className="td">{group.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <form onSubmit={handleSubmit}>
              <label htmlFor="groupName">New Group Name:</label>
              <input
                id="groupName"
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                required
              />

              <label htmlFor="members">Members (comma-separated):</label>
              <input
                id="members"
                type="text"
                value={newMembers}
                onChange={(e) => setNewMembers(e.target.value)}
                placeholder="e.g., John Doe, Jane Smith"
                required
              />

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupsPreview;
