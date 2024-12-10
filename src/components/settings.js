import React from 'react';
import { FaRegTrashCan } from "react-icons/fa6";
import { PiSignOutBold } from "react-icons/pi";
import ProfilePicture from './profile-picture';
import './styling/settings.css';


function Settings() {
  return (
    <div className='settings'>
      <div className='personal-info'>
          <div className='profile-picture-box'>
              <ProfilePicture src="https://via.placeholder.com/150" 
                  alt="Sample Photo" 
                  size={100} 
              ></ProfilePicture>
              <div className='pfp-options'>
                <button className='settings-button-1'>Update profile picture</button>
                <button className='settings-button-1'>Delete</button>


              </div>
          </div>
          <h4>Full Name</h4>
          <div className='name-box'>
            <div className='first-name'>
              <label>First Name</label>
              <input
                type="firstName"
                name="firstName"
              />
            </div>
            <div className='last-name'>
              <label>Last Name</label>
              <input
                type="lastName"
                name="lastName"
              />
            </div>
          </div>
          <button className='change-name'>Save name</button>
      </div>
      <hr className='solid-divider'></hr>
      <div className='contact-info'>
          <h4>Email</h4>
          <div className='email-box'>
            email goes here
          </div>
      </div>
      <hr className='solid-divider'></hr>
      <div className='password'>
        <h4>Password</h4>
        <p>Edit your password</p>
        <div className='password-box'>
          <div className='current-password'>
              <label>Confirm password</label>
              <input
                type="firstName"
                name="firstName"
              />
            </div>
            <div className='new-password'>
              <label>New password</label>
              <input
                type="lastName"
                name="lastName"
              />
            </div>
        </div>
          
      </div>
      <hr className='solid-divider'></hr>
      <div className='account-security'>
          <h4>Account security</h4>
          <div className='account-security-options'>
            <button className='settings-button-1'><PiSignOutBold /> Log out </button>
            <button className='delete-button'><FaRegTrashCan /> Delete account</button>
          </div>
      </div>
    </div>
  );
}

export default Settings;
