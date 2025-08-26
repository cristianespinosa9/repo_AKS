import express from "express";
import pkg from "pg";
import os from "os";
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.PGHOST || "postgres",
  user: process.env.PGUSER || "appuser",
  password: process.env.PGPASSWORD || "Str0ngPwd!",
  database: process.env.PGDATABASE || "appdb",
  port: parseInt(process.env.PGPORT || "5432", 10),
  ssl: false
});

const app = express();
const port = process.env.PORT || 3000;

await pool.query(`
  CREATE TABLE IF NOT EXISTS messages(
    id SERIAL PRIMARY KEY,
    text VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
  );
`);

app.get("/health", async (_req, res) => {
  try { await pool.query("SELECT 1"); res.send("ok"); }
  catch { res.status(500).send("db down"); }
});

app.get("/", async (_req, res) => {
  const msg = `Hello from ${os.hostname()}`;
  await pool.query("INSERT INTO messages(text) VALUES($1)", [msg]);
  const { rows } = await pool.query("SELECT count(*) FROM messages");
  res.send(` ${msg}. Total messages: ${rows[0].count}`);
});

app.get("/messages", async (_req, res) => {
  const { rows } = await pool.query("SELECT id,text,created_at FROM messages ORDER BY id DESC LIMIT 20");
  res.json(rows);
});

app.listen(port, () => console.log(`App listening on :${port}`));
