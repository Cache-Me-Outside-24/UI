const GROUP_SERVICE_API_BASE_URL =
  process.env.REACT_APP_GROUP_SERVICE_API_BASE_URL;
export const fetchGroups = async (limit = 10, offset = 0) => {
  const response = await fetch(
    `${GROUP_SERVICE_API_BASE_URL}/groups?limit=${limit}&offset=${offset}`
  );
  if (!response.ok) throw new Error("Failed to fetch groups");

  const data = await response.json();
  return data;
};

export const fetchGroupById = async (groupId) => {
  const response = await fetch(
    `${GROUP_SERVICE_API_BASE_URL}/groups/${groupId}`
  );
  if (!response.ok) throw new Error("Failed to fetch group details");

  const data = await response.json();
  return data;
};

export const createGroup = async (groupData) => {
  const response = await fetch(`${GROUP_SERVICE_API_BASE_URL}/groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(groupData),
  });
  if (!response.ok) throw new Error("Failed to create group");

  const data = await response.json();
  return data;
};

export const fetchGroupMembers = async (groupId) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_GROUP_SERVICE_API_BASE_URL}/groups/${groupId}/members`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch group members for group ${groupId}`);
    }

    const data = await response.json();

    return data.members;
  } catch (error) {
    console.error("Error fetching group members:", error);
    return [];
  }
};
