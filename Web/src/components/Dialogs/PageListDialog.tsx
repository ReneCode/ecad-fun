import React, { useEffect, useState } from "react";

import { Project } from "../../share/Project";

type Props = {
  project: Project;
};

const PageListDialog: React.FC<Props> = ({ project }) => {
  const [pages, setPages] = useState([] as string[]);
  useEffect(() => {
    // const pages = project.query({ q: { type: "page" });
  }, [project]);

  return (
    <div>
      {pages.map((page) => {
        return { page };
      })}
    </div>
  );
};

export default PageListDialog;
