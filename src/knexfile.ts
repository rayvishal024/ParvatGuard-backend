import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

// If you provide a full DATABASE_URL (for example a Neon connection string),
// prefer that. When using a cloud provider like Neon, SSL is required so we
// apply `ssl: { rejectUnauthorized: false }` to the connection object.
const DATABASE_URL = process.env.DATABASE_URL?.trim() || null;

function buildConnection(dbName?: string) {
  if (DATABASE_URL) {
    // Return an object compatible with node-postgres when using a connection string
    return {
      connectionString: DATABASE_URL,
      ssl:
        process.env.DB_SSL === "true" || /sslmode=require/.test(DATABASE_URL)
          ? { rejectUnauthorized: false }
          : false,
    } as any;
  }

  const conn: Record<string, unknown> = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    database: dbName || process.env.DB_NAME || "parvatguard",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
  };

  conn.ssl =
    process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false;

  return conn;
}

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: buildConnection(process.env.DB_NAME || "parvatguard"),
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },

  test: {
    client: "postgresql",
    connection: buildConnection(process.env.DB_TEST_NAME || "parvatguard_test"),
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },

  production: {
    client: "postgresql",
    connection: buildConnection(),
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },
};

export default config;
