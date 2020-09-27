import React, { useEffect } from "react";
import io from "socket.io-client";
import { Project, ObjectType } from "multiplayer";

const WS_SERVER = process.env.REACT_APP_WEBSOCKET_SERVER as string;

type Props = {
  projectId: string;
  project: Project;
};

const Socket: React.FC<Props> = ({ projectId, project }) => {
  useEffect(() => {
    const socket = io(WS_SERVER);
    socket.on("open-project", (data: any) => {
      // project.setRoot(data);
      console.log("project:", data);
    });

    socket.on("create-object", (data: ObjectType) => {
      console.log("got createObject", data);
      project.createObject(data);
    });

    project.subscribe("create-object", (data: ObjectType) => {
      console.log("createObject", data);
      socket.emit("create-object", data);
    });
    project.subscribe("update-object", (data: any) => {
      socket.emit("update-object", data);
    });
    project.subscribe("delete-object", (data: any) => {
      socket.emit("delete-object", data);
    });

    socket.emit("open-project", projectId);
    return () => {
      socket.disconnect();
    };
  }, [projectId, project]);

  return null;
};

export default Socket;
