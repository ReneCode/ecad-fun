import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";

import { useUserId } from "./useUserId";

const ProjectList = () => {
  const userId = useUserId();
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState("");

  useEffect(() => {
    const getData = async () => {
      const token = await getAccessTokenSilently({});

      const url = `${process.env.REACT_APP_SERVER}/api/private`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const text = await response.text();
        setData(text);
      }
    };

    getData();
  }, [userId]);
  return <div>project list. Data:{data}</div>;
};

export default ProjectList;
