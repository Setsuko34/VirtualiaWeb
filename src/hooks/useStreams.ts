import { useEffect, useState } from 'react';

export interface LiveStream {
  id: string;
  name: string;
  title: string;
  viewers: string;
  login: string;
}

function twitchParent(): string {
  try { return window.location.hostname || 'localhost'; } catch { return 'localhost'; }
}

export function twitchEmbed(login: string): string {
  return `https://player.twitch.tv/?channel=${encodeURIComponent(login)}&parent=${encodeURIComponent(twitchParent())}&muted=true&autoplay=false`;
}

/** Récupère les streams en direct via l'API du backend (/api/twitch/streams). */
export function useStreams() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function fetchStreams() {
      try {
        const r = await fetch('/api/twitch/streams');
        if (!r.ok) throw new Error('api');
        const j = await r.json();
        const data: any[] = j?.data || [];
        const list: LiveStream[] = data
          .filter((it) => it.stream)
          .map((it) => {
            const s = it.stream;
            const p = it.participant;
            const login = p?.socialMedia?.twitch ? String(p.socialMedia.twitch).toLowerCase() : '';
            return {
              id: it.id,
              name: p?.name || login || 'Unknown',
              title: s?.title || 'Live',
              viewers: (s?.viewer_count || 0).toLocaleString(),
              login,
            };
          });
        if (alive) { setStreams(list); setLoading(false); }
      } catch {
        if (alive) { setStreams([]); setLoading(false); }
      }
    }
    fetchStreams();
    const id = setInterval(fetchStreams, 30000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const liveLogins = streams.map((s) => s.login);
  return { streams, loading, liveLogins };
}
