import React, { createContext, useState } from "react";

// Temporary Context and Provider to serve mock data to the front end
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // State for users and groups
  const [users, setUsers] = useState([]);

  const [groups, setGroups] = useState([
    {
      name: "Cache-Me-Outside",
      members: ["john@example.com", "jane@example.com"],
    },
  ]);

  return (
    <AppContext.Provider value={{ users, setUsers, groups, setGroups }}>
      {children}
    </AppContext.Provider>
  );
};
