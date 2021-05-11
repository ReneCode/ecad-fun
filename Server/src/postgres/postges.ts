const { Pool, Client } = require("pg");

require("dotenv").config();

const pool = new Pool();

const pgGetClient = () => {
  const options = {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    database: "postgres",
  };
  const client = new Client(options);
  return client;
};

export const pgCreateDatabaseIfNotExists = async (name: string) => {
  // create database without transaction
  const client = pgGetClient();
  client.connect();
  const res = await client.query(
    "SELECT * from pg_database WHERE datname = $1",
    [name]
  );
  if (res.rows.length === 0) {
    await client.query(`CREATE DATABASE ${name}`);
  }
};
