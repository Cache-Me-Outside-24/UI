import React, { useState } from "react";
import Header from "../components/header";
import CreateGroupForm from "../components/create-group-form";
import "../styling/login.css";

function CreateGroup() {
  return (
    <div className="create-group-page">
      <Header />
      <CreateGroupForm hideHeader={false} hideButtons={false} />
    </div>
  );
}

export default CreateGroup;
