const { createClient } = require('@libsql/client');

// TURSO_DATABASE_URL et TURSO_AUTH_TOKEN sont definis dans les variables
// d'environnement Vercel (jamais dans le code).
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function ensureSchema() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS participants (
      token          TEXT PRIMARY KEY,
      employee_id    TEXT,
      nom            TEXT,
      email          TEXT NOT NULL,
      campagne       TEXT NOT NULL,
      clicked_at     TEXT,
      ip_address     TEXT,
      created_at     TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

module.exports = { db, ensureSchema };
