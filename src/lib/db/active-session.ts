import type { WorkoutSession } from '../api/types';
import { db } from './database';

export const activeSessionStore = {
  save(session: WorkoutSession) {
    db.runSync(
      `INSERT OR REPLACE INTO active_session (id, payload, updated_at)
       VALUES (?, ?, ?)`,
      session.id,
      JSON.stringify(session),
      new Date().toISOString(),
    );
  },

  get(): WorkoutSession | null {
    const row = db.getFirstSync<{ payload: string }>(
      'SELECT payload FROM active_session LIMIT 1',
    );
    return row ? JSON.parse(row.payload) : null;
  },

  clear() {
    db.runSync('DELETE FROM active_session');
  },
};
