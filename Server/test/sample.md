GET file

const key = await fetch.postFile("api.ecad.fun/files", { name: "new"} )

const socket = connectWebsocket("ecad.fun/ws/files/:key")

socket.on("getFile", () => {
const project = fileJson.project;
socket.emit("create", { type:"LINE"})
})
socket.emit("getFile")

# file

## new file

new file has one page and project.currentProject set

# ws-server commands

## "create" + node-payload



node-payload: { id: "43:4", type:"LINE", x1:13, y1:30, x2: 50, y2: 20 }

- check payload
- merge into project
- response :
  { "ack", id: id } to sender
  { "create", { payload } to other clients

## "change" + change-payload
