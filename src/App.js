import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import SignUp from "./pages/sign-up";
import LogIn from "./pages/login";
import Groups from "./pages/groups";
import Balances from "./pages/balances";
import CreateGroup from "./pages/create-group";
import CreateExpense from "./pages/create-expense";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "./AuthContext";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route
              path="/groups"
              element={
                <PrivateRoute>
                  <Groups />
                </PrivateRoute>
              }
            />
            <Route
              path="/balances"
              element={
                <PrivateRoute>
                  <Balances />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-group"
              element={
                <PrivateRoute>
                  <CreateGroup />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-expense"
              element={
                <PrivateRoute>
                  <CreateExpense />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
