// Plain JS knexfile so the CLI can find configuration without TS tooling
// Mirrors src/knexfile.ts
require("dotenv").config();

const DATABASE_URL = (process.env.DATABASE_URL || "").trim() || null;

function buildConnection(dbName) {
  if (DATABASE_URL) {
    return {
      connectionString: DATABASE_URL,
      ssl: (process.env.DB_SSL === 'true' || /sslmode=require/.test(DATABASE_URL)) ? { rejectUnauthorized: false } : false,
    };
  }
  const conn = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    database: dbName || process.env.DB_NAME || "parvatguard",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
  };
  conn.ssl =
    process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false;
  return conn;
}

/** @type {import('knex').Knex.Config} */
const development = {
  client: "postgresql",
  connection: buildConnection(process.env.DB_NAME || "parvatguard"),
  pool: { min: 2, max: 10 },
  migrations: { tableName: "knex_migrations", directory: "./migrations" },
  seeds: { directory: "./seeds" },
};

/** @type {import('knex').Knex.Config} */
const test = {
  client: "postgresql",
  connection: buildConnection(process.env.DB_TEST_NAME || "parvatguard_test"),
  pool: { min: 2, max: 10 },
  migrations: { tableName: "knex_migrations", directory: "./migrations" },
  seeds: { directory: "./seeds" },
};

/** @type {import('knex').Knex.Config} */
const production = {
  client: "postgresql",
  connection: buildConnection(),
  pool: { min: 2, max: 10 },
  migrations: { tableName: "knex_migrations", directory: "./migrations" },
};

module.exports = { development, test, production };
