import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import SignUp from './pages/sign-up';
import LogIn from './pages/login';

import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/sign-up" element={<SignUp/>} />
            <Route path="/login" element={<LogIn/>} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
