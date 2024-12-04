import React, { useState } from "react";
import Header from "../components/header";
import "../styling/login.css";
import CreateExpensesForm from "../components/create-expense-form";

function CreateExpense() {
  return (
    <div className="create-expense-page">
      <Header />
      <CreateExpensesForm />
    </div>
  );
}

export default CreateExpense;
