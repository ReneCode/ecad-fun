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

## Multiplayer

- ClientId holen / ClientService
- ObjectModel
  - Properties
  - Index
  - Scheme

## Object

- id: {clientId:counter}
- type: string
- props: Record<string, any>

{
id: "3:42",
type: "page",
name: "hello",
x: 3.6,
locked: true
}
