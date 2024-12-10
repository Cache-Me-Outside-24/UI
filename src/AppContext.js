import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

// Temporary Context and Provider to serve mock data to the front end
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user, loading } = useAuth();

  const apiURL = process.env.REACT_APP_GROUP_SERVICE_API_BASE_URL;

  const [groups, setGroups] = useState([]);
  const [groupLinks, setGroupLinks] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (loading) return;
        if (!user || !user.uid) {
          console.warn("User is not authenticated");
          return;
        }

        const response = await fetch(
          `${apiURL}/groups?user_id=${user.uid}&limit=${10}&offset=${0}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch groups");
        }

        const data = await response.json();

        // Update groups with the fetched data
        setGroups(data.data);
        setGroupLinks(data.links);
      } catch (err) {
        console.error("Error fetching groups:", err.message);
      }
    };

    fetchGroups();
  }, [user, loading]);

  return (
    <AppContext.Provider
      value={{ groups, setGroups, groupLinks, setGroupLinks }}
    >
      {children}
    </AppContext.Provider>
  );
};
