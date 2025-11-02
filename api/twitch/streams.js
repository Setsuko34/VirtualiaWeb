// javascript
      // File: `api/twitch/streams.js`
      import fs from 'fs';
      import os from 'os';
      import path from 'path';

      function loadParticipants() {
        try {
          const jsonPath = path.join(process.cwd(), 'src', 'data', 'participants.json');
          const raw = fs.readFileSync(jsonPath, 'utf8');
          return JSON.parse(raw);
        } catch (e) {
          console.warn('[streams] failed to load participants.json', String(e));
          return [];
        }
      }
      const participants = loadParticipants();

      const CACHE_FILE = path.join(os.tmpdir(), 'starlight_streams.json');
      const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
      const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

      function safeReadCache(filePath) {
        try {
          const raw = fs.readFileSync(filePath, 'utf8');
          const parsed = JSON.parse(raw);
          // Expect object { data: array, meta }
          if (parsed && Array.isArray(parsed.data)) return parsed;
          // backwards compatibility: if whole file is array, wrap
          if (Array.isArray(parsed)) return { data: parsed, meta: { writtenAt: 0 } };
          throw new Error('cache invalid');
        } catch {
          return null;
        }

      }
      function safeWriteCacheAtomic(filePath, data) {
        try {
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) {
            try { fs.mkdirSync(dir, { recursive: true }); } catch (e) { /* ignore */ }
          }
          const tmp = `${filePath}.tmp`;
          // write as object with meta when provided as an object, otherwise as { data }
          const toWrite = Array.isArray(data) ? { data, meta: { writtenAt: Date.now() } } : (data.meta ? data : { data, meta: { writtenAt: Date.now() } });
          fs.writeFileSync(tmp, JSON.stringify(toWrite));
          fs.renameSync(tmp, filePath);
        } catch (e) {
          console.warn('safeWriteCacheAtomic failed:', String(e).slice(0, 200));
        }
      }

      // Return cached data if fresh (ttlMs), else null
      function getCachedIfFresh(filePath, ttlMs = 30000) {
        try {
          const p = safeReadCache(filePath);
          if (!p || !p.meta || !Array.isArray(p.data)) return null;
          const age = Date.now() - (p.meta.lastUpdated || p.meta.writtenAt || 0);
          if (age <= ttlMs) return p.data;
          // still return the parsed object so caller can decide, but indicate stale
          return null;
        } catch (e) {
          return null;
        }
      }

      async function safeFetchJson(url, opts = {}) {
        const resp = await fetch(url, opts);
        const txt = await resp.text();
        const ct = (resp.headers.get('content-type') || '').toLowerCase();
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status} ${url}: ${txt.slice(0, 500)}`);
        }
        if (!ct.includes('application/json')) {
          throw new Error(`Non-JSON from ${url}: ${txt.slice(0, 200)}`);
        }
        try {
          return JSON.parse(txt);
        } catch (e) {
          throw new Error(`Invalid JSON from ${url}: ${String(e).slice(0,200)}`);
        }
      }

      async function getAppToken() {
        if (!CLIENT_ID || !CLIENT_SECRET) {
          console.warn('[streams] TWITCH_CLIENT_ID / TWITCH_CLIENT_SECRET not set; skipping Twitch API');
          return null;
        }
        const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
        try {
          const resp = await fetch(url, { method: 'POST' });
          const txt = await resp.text();
          if (!resp.ok) {
            console.warn('[streams] Twitch token endpoint returned', resp.status, txt.slice(0,200));
            return null;
          }
          try { return JSON.parse(txt).access_token; } catch (e) { console.warn('[streams] invalid token JSON', e); return null; }
        } catch (e) {
          console.warn('[streams] getAppToken network error', String(e));
          return null;
        }
      }

      async function fetchLiveStreams() {
        const accessToken = await getAppToken();
        if (!accessToken) {
          // no token -> return fallback (no streams) to avoid throwing
          return participants.map(p => ({ id: p.id, participant: p, stream: null }));
        }
         const logins = Array.from(
           new Set(
             participants
               .map(p => (p.socialMedia && p.socialMedia.twitch ? String(p.socialMedia.twitch).toLowerCase() : null))
               .filter(Boolean)
           )
         );

         if (logins.length === 0) {
           return participants.map(p => ({ id: p.id, participant: p, stream: null }));
         }

         const usersUrl = `https://api.twitch.tv/helix/users?${logins.map(l => `login=${encodeURIComponent(l)}`).join('&')}`;
         const usersData = await safeFetchJson(usersUrl, { headers: { 'Client-ID': CLIENT_ID, Authorization: `Bearer ${accessToken}` } });
         const idMap = new Map((usersData.data || []).map(u => [u.id, u.login.toLowerCase()]));
         const userIds = Array.from(idMap.keys());
         if (userIds.length === 0) return participants.map(p => ({ id: p.id, participant: p, stream: null }));

         const streamsUrl = `https://api.twitch.tv/helix/streams?${userIds.map(id => `user_id=${encodeURIComponent(id)}`).join('&')}`;
         const streamsData = await safeFetchJson(streamsUrl, { headers: { 'Client-ID': CLIENT_ID, Authorization: `Bearer ${accessToken}` } });

         const streamByLogin = new Map();
         (streamsData.data || []).forEach(s => {
           const login = idMap.get(s.user_id);
           if (login) streamByLogin.set(login.toLowerCase(), s);
         });

         return participants.map(p => {
           const login = p.socialMedia && p.socialMedia.twitch ? String(p.socialMedia.twitch).toLowerCase() : null;
           return { id: p.id, participant: p, stream: login ? (streamByLogin.get(login) || null) : null };
         });
       }

      export default async function handler(req, res) {
        // Always reply JSON
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        // Wrap whole handler to avoid unhandled exceptions
        try {
          // Debug route
          if (req.method === 'GET' && req.query && req.query.action === 'debug') {
            const envInfo = { TWITCH_CLIENT_ID: !!CLIENT_ID, TWITCH_CLIENT_SECRET: !!CLIENT_SECRET };
            const cacheExists = fs.existsSync(CACHE_FILE);
            let cachePreview = null;
            try { if (cacheExists) cachePreview = fs.readFileSync(CACHE_FILE, 'utf8').slice(0, 2000); } catch (e) { cachePreview = String(e); }
            // try to fetch token and optionally live streams (return errors instead of throwing)
            let token = null;
            try { token = await getAppToken(); } catch (e) { token = null; }
            let live = null;
            try { if (token) live = await fetchLiveStreams(); else live = { error: 'no-token' }; } catch (e) { live = { error: String(e) }; }
            return res.status(200).json({ ok: true, env: envInfo, cacheFile: CACHE_FILE, cacheExists, cachePreview, token: !!token, liveSample: Array.isArray(live) ? live.slice(0,5) : live });
          }
          // Force refresh route for debugging: ?action=refresh
          if (req.method === 'GET' && req.query && req.query.action === 'refresh') {
            try {
              const data = await fetchLiveStreams();
              if (Array.isArray(data)) {
                safeWriteCacheAtomic(CACHE_FILE, { data, meta: { lastUpdated: Date.now() } });
                return res.status(200).json({ ok: true, count: data.length, sample: data.slice(0,5) });
              }
              return res.status(200).json({ ok: false, error: 'fetch returned invalid data' });
            } catch (e) {
              console.error('[streams] refresh action error', String(e));
              return res.status(500).json({ ok: false, error: String(e) });
            }
          }

           // Only support GET — but return a JSON warning instead of 4xx/5xx
           if (req.method !== 'GET') {
             const fallback = participants.map(p => ({ id: p.id, participant: p, stream: null }));
             return res.status(200).json({ data: fallback, warning: 'Only GET supported on this endpoint' });
           }

           // prefer recent cache to avoid flicker during transient errors
          const cachedFresh = getCachedIfFresh(CACHE_FILE, 30000); // 30s TTL
          if (cachedFresh) {
            console.log('[streams] returning fresh cache with', cachedFresh.length, 'items');
            return res.status(200).json({ data: cachedFresh });
          }

          // if no fresh cache, try reading any cache to use as fallback in case live fetch fails
          const anyCached = safeReadCache(CACHE_FILE);

          // Fetch live data
          let data;
          try {
            data = await fetchLiveStreams();
          } catch (e) {
            console.error('[streams] fetchLiveStreams failed', String(e));
            data = null;
          }

          if (data && Array.isArray(data)) {
            safeWriteCacheAtomic(CACHE_FILE, { data, meta: { lastUpdated: Date.now() } });
            return res.status(200).json({ data });
          }

          // fallback
          const fallback = anyCached && Array.isArray(anyCached.data) ? anyCached.data : participants.map(p => ({ id: p.id, participant: p, stream: null }));
          return res.status(200).json({ data: fallback, warning: 'Using fallback due to Twitch API unavailable' });
        } catch (err) {
          console.error('[streams] handler unexpected error', String(err));
          const fallback = participants.map(p => ({ id: p.id, participant: p, stream: null }));
          return res.status(200).json({ data: fallback, warning: 'Internal error' });
        }
      }
