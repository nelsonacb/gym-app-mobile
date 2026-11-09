import { SessionStatus } from '@/lib/api/types';

export function formatDuration(seconds: number | null): string {
  if (!seconds) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatVolume(volume: number | null): string {
  if (volume === null) return '—';
  return `${volume.toLocaleString()} kg`;
}

export const FILTERS: { key: SessionStatus; label: string }[] = [
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'IN_PROGRESS', label: 'In progress' },
  { key: 'CANCELLED', label: 'Cancelled' },
];
