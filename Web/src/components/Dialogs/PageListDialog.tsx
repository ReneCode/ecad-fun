import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

import { Project } from "../../share/Project";

import "./PageListDialog.scss";
type Props = {
  project: Project;
};

const PageListDialog: React.FC<Props> = ({ project }) => {
  const history = useHistory();
  const [pages, setPages] = useState(
    [] as {
      id: string;
      name: string;
    }[]
  );

  useEffect(() => {
    setPages(
      project
        .query({ q: { type: "page" } })
        .map((o) => ({ id: o.id, name: o.name as string }))
    );
  }, [project]);

  const onClick = (id: string) => {
    const projectId = project.id;
    const url = `/p/${projectId}?pid=${id}`;
    history.push(url);
  };

  return (
    <div className="page-list-dialog">
      <button>+</button>
      <ul>
        {pages.map((p, index) => {
          return (
            <li key={index}>
              <div onClick={() => onClick(p.id)}>{p.name}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PageListDialog;
