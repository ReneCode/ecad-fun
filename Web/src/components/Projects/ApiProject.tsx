export const apiGetAllProjects = async (token: string) => {
  if (!token) {
    return [];
  }
  const url = `${process.env.REACT_APP_SERVER}/api/projects`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const projects = await response.json();
    return projects;
  }
  return [];
};

export const apiCreateProject = async (token: string, newName: string) => {
  if (!token) {
    return null;
  }
  const url = `${process.env.REACT_APP_SERVER}/api/projects`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: newName }),
  });
  if (response.ok) {
    const project = await response.json();
    return project;
  }
  return null;
};

export const apiUpdateProject = async (
  token: string,
  projectId: string,
  newName: string
) => {
  if (!token || !projectId) {
    return null;
  }
  const url = `${process.env.REACT_APP_SERVER}/api/projects/${projectId}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: newName }),
  });
  if (response.ok) {
    const project = await response.json();
    return project;
  }
  return null;
};
