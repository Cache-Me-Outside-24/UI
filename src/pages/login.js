import React, { useState } from 'react';
import LogInForm from '../components/login-form';
import Header from '../components/header';
import '../styling/login.css';

function LogIn() {

  return (
    <div className="login-page">
        <Header/>
        <div className='login-container'>
            <LogInForm/>
        </div>
    </div>
  );
}

export default LogIn;
