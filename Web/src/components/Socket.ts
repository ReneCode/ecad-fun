import React, { useEffect } from "react";
import io from "socket.io-client";

const WS_SERVER = process.env.REACT_APP_WEBSOCKET_SERVER as string;

type Props = {
  projectId: string;
};

const Socket: React.FC<Props> = ({ projectId }) => {
  useEffect(() => {
    const socket = io(WS_SERVER);
    socket.on("open-project", (data: any) => {
      console.log("project:", data);
    });

    socket.emit("open-project", projectId);
    return () => {
      socket.disconnect();
    };
  }, [projectId]);

  return null;
};

export default Socket;
