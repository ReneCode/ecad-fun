# rules

## client

discard incomming changes from the server that conflict with unacknowledged property changes

- delete: store props of deleted object in client UndoList

- id : client-Id + Counter

# Authentication

https://www.youtube.com/watch?v=NuCZgR09csE&list=PLZ14qQz3cfJL6aoKZ_Ly7jiYrwi9ihviW&index=2

https://auth0.com/docs/quickstart/spa/react/02-calling-an-api

https://github.com/auth0-blog/auth0-react-sdk-video/blob/starter/src/server/api-server.js

# Client-Server Communication

sync

- C -> S: get ClientId

async live query

- C -> S: (live)query data
- S -> C: send query-result data

async change data

- C -> S: change data
- S -> C: ack/reject to sender client
- S -> Cx: send changed data, if in live-query

# Server

## parent property

special property with syntax: `<parentId>:<fIndex>`

```js
E1 = { id: "4" }
E2 = { parent: "4:5" }
E3 = { parent: "4:6" }
=> E1.children = [E2, E3]

E4 = { parent: "4:55" }
=> E1.children = [E2, E4, E3]

E5 = { parent: "4:5"}
=> E1.children = [E2, E5, E4, E3]
=> fix E5 = { parent: "4:51"}
```

if fIndex property is already taken, that change it to a new fIndex straight after the current fIndex. For that, query all the objects with the same parentId.

## Multiplayer

- ClientId holen / ClientService
- ObjectModel
  - Properties
  - Index
  - Scheme

## Element

- id: `<clientId>:<counter>`
- type: string
- props: Record<string, any>

example:

```
element = {
  id: "3:42",
  type: "page",
  name: "hello",
  x: 3.6,
  locked: true
}
```

## Protocol

### messages C -> S

connect
disconnect
openDocument -> clientId
closeDocument

create
remove
update

query

## message S -> C

create
remove
update
