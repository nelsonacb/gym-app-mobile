import { db } from './database';

export const offlineQueue = {
  enqueue(mutationKey: string, variables: unknown) {
    db.runSync(
      `INSERT INTO offline_queue (mutation_key, variables, created_at)
       VALUES (?, ?, ?)`,
      mutationKey,
      JSON.stringify(variables),
      new Date().toISOString(),
    );
  },

  getAll(): Array<{ id: number; mutationKey: string; variables: unknown }> {
    const rows = db.getAllSync<{
      id: number;
      mutation_key: string;
      variables: string;
    }>('SELECT * FROM offline_queue ORDER BY id ASC');
    return rows.map((r) => ({
      id: r.id,
      mutationKey: r.mutation_key,
      variables: JSON.parse(r.variables),
    }));
  },

  remove(id: number) {
    db.runSync('DELETE FROM offline_queue WHERE id = ?', id);
  },

  clear() {
    db.runSync('DELETE FROM offline_queue');
  },
};
