import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";

import Card from "./Card";
import { useUserId } from "../useUserId";

import "./Projects.scss";
import Header from "../Header";
import Button from "../Button";
import { useHistory } from "react-router";

const Projects = () => {
  const userId = useUserId();
  const { getAccessTokenSilently } = useAuth0();
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const history = useHistory();

  useEffect(() => {
    const getData = async () => {
      const token = await getAccessTokenSilently({});

      const url = `${process.env.REACT_APP_SERVER}/api/projects`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const projects = await response.json();
        setProjects(projects);
      }
    };

    getData();
  }, [userId, getAccessTokenSilently]);

  const addProject = async () => {
    const token = await getAccessTokenSilently();
    const url = `${process.env.REACT_APP_SERVER}/api/projects`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "Untitled" }),
    });
    if (response.ok) {
      const project = await response.json();
      setProjects([project].concat(projects));
    }
  };

  const openProject = async (projectId: string) => {
    console.log("open project", projectId);
    history.push(`/p/${projectId}`);
  };

  return (
    <div>
      <Header></Header>
      <div className="projects-header">
        <div>Project list</div>
        <Button onClick={addProject}>New Project</Button>
      </div>
      <div className="project-list">
        {projects.map((project) => {
          return (
            <Card key={project.id} onClick={() => openProject(project.id)}>
              <div className="project-card">{project.name}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
