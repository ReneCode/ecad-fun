import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";

import Card from "./Card";
import { useUserId } from "../useUserId";

import "./Projects.scss";
import Header from "../Header";

const Projects = () => {
  const userId = useUserId();
  const { getAccessTokenSilently } = useAuth0();
  const [projects, setProjects] = useState<{ name: string }[]>([]);

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

  return (
    <div>
      <Header></Header>
      Project list
      <div className="project-list">
        {projects.map((project) => {
          return <Card>{project.name}</Card>;
        })}
      </div>
    </div>
  );
};

export default Projects;
