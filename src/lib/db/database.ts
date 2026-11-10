import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('forgefit.db');

export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS active_session (
      id TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS offline_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mutation_key TEXT NOT NULL,
      variables TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}
