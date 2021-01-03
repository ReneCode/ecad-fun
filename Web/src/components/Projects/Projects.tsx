import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router";

import "./Projects.scss";
import Card from "./Card";
import Header from "../Header";
import Button from "../Button";
import { useUserId } from "../useUserId";

import {
  apiCreateProject,
  apiGetAllProjects,
  apiUpdateProject,
} from "./ApiProject";

type DbProject = {
  id: string;
  name: string;
  editable: boolean;
};

const Projects = () => {
  const userId = useUserId();
  const { getAccessTokenSilently } = useAuth0();
  const [projects, setProjects] = useState<DbProject[]>([]);
  const history = useHistory();

  useEffect(() => {
    const getData = async () => {
      const token = await getAccessTokenSilently({});
      const projects = await apiGetAllProjects(token);
      if (projects) {
        setProjects(projects);
      }
    };

    getData();
  }, [userId, getAccessTokenSilently]);

  const addProject = async () => {
    const token = await getAccessTokenSilently();
    const project = await apiCreateProject(token, "Untitled");
    if (project) {
      setProjects(projects.concat(project));
    }
  };

  const openProject = async (projectId: string) => {
    history.push(`/p/${projectId}`);
  };

  const editProjectName = (ev: React.MouseEvent, projectId: string) => {
    ev.stopPropagation();
    setProjects(
      projects.map((p) => {
        if (p.id === projectId) {
          return { ...p, editable: true };
        }
        return p;
      })
    );
  };

  const finishEditProjectName = async (
    ev: React.FocusEvent,
    projectId: string
  ) => {
    ev.stopPropagation();
    const newName = ev.target.innerHTML;
    const project = await apiUpdateProject(
      await getAccessTokenSilently(),
      projectId,
      newName
    );
    if (project) {
      setProjects(
        projects.map((p) => {
          if (p.id === projectId) {
            return { ...p, editable: false, name: project.name };
          }
          return p;
        })
      );
    }
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
              <div
                className="project-card"
                contentEditable={project.editable}
                suppressContentEditableWarning={true}
                onClick={(ev) => editProjectName(ev, project.id)}
                onBlur={(ev) => finishEditProjectName(ev, project.id)}
              >
                {project.name}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
