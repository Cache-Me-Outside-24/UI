import React, { useState } from 'react';
import SignUpForm from '../components/sign-up-form';
import Header from '../components/header';
import '../styling/sign-up.css';

function SignUp() {

  return (
    <div className="signup-page">
        <Header/>
        <div className='signup-container'>
            <SignUpForm/>
        </div>
    </div>
  );
}

export default SignUp;
