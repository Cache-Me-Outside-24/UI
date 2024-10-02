import React from 'react';
import './home-signed-in.css'
import ChargesTable from './charges-table'
import GroupsPreview from './groups-preview';
import Button from './button';

function HomeSignedChild() {
  return (
    <div className="home-content-signed">
        <div className='left-content'>
            <div className='charge-container'>
                <h3> You are owed  </h3>
                <ChargesTable action='Remind'/>
                <h3> You owe </h3>
                <ChargesTable action='Pay'/>
            </div>
        </div>
        <div className='right-content'>
            <div className='groups-container'>
                <GroupsPreview/>
            </div>
        </div>

    </div>
  );
}

export default HomeSignedChild;
