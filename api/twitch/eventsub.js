// javascript
// === Modifs pour `api/twitch/eventsub.js` (ajouter ces helpers en haut du fichier) ===
import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';

export const config = { api: { bodyParser: false } };

const CACHE_FILE = path.join(os.tmpdir(), 'starlight_streams.json');
const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const EVENTSUB_SECRET = process.env.TWITCH_EVENTSUB_SECRET;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

let streamsCache = null;
let appToken = null;
let tokenExpiresAt = 0;

async function getAppTokenLocal() {
  // Return cached token if still valid (1 min leeway)
  if (appToken && Date.now() < tokenExpiresAt - 60000) return appToken;

  if (!CLIENT_ID || !CLIENT_SECRET) throw new Error('Missing TWITCH_CLIENT_ID / TWITCH_CLIENT_SECRET');
  const resp = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
    { method: 'POST' }
  );

  const txt = await resp.text();
  if (!resp.ok) throw new Error(`Failed to get Twitch token ${resp.status}: ${txt.slice(0, 500)}`);

  let json;
  try {
    json = JSON.parse(txt);
  } catch (e) {
    throw new Error('Failed to parse Twitch token response');
  }
  if (!json.access_token) throw new Error('No access_token in Twitch token response');
  appToken = json.access_token;
  const expires = Number(json.expires_in) || 3600;
  tokenExpiresAt = Date.now() + expires * 1000;
  return appToken;
}

function safeReadCache(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    // Expect object with .data array
    if (!parsed || !Array.isArray(parsed.data)) return null;
    return parsed;
  } catch (e) {
    console.warn('[eventsub] safeReadCache failed', String(e));
    return null;
  }
}

function safeWriteCacheAtomic(filePath, dataObj) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      try { fs.mkdirSync(dir, { recursive: true }); } catch (e) { /* ignore */ }
    }
    const tmp = `${filePath}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(dataObj));
    fs.renameSync(tmp, filePath);
  } catch (e) {
    console.warn('[eventsub] safeWriteCacheAtomic failed', String(e).slice(0,200));
  }
}

async function listEventSubSubscriptions(accessToken) {
  const urlBase = 'https://api.twitch.tv/helix/eventsub/subscriptions';
  let all = [];
  let cursor = undefined;
  try {
    do {
      const q = cursor ? `${urlBase}?first=100&after=${encodeURIComponent(cursor)}` : `${urlBase}?first=100`;
      const resp = await fetch(q, { headers: { 'Client-ID': CLIENT_ID, Authorization: `Bearer ${accessToken}` } });
      if (!resp.ok) {
        const t = await resp.text();
        throw new Error(`list subs failed ${resp.status}: ${t.slice(0,200)}`);
      }
      const json = await resp.json();
      if (Array.isArray(json.data)) all = all.concat(json.data);
      cursor = json.pagination && json.pagination.cursor ? json.pagination.cursor : undefined;
    } while (cursor);
    console.log('[eventsub] listEventSubSubscriptions: total found', all.length);
    return all;
  } catch (e) {
    console.error('[eventsub] listEventSubSubscriptions error', String(e));
    throw e;
  }
}

async function createSubscription(body, accessToken) {
  console.log('[eventsub] creating subscription', body.type, body.condition);
  const resp = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
    method: 'POST',
    headers: { 'Client-ID': CLIENT_ID, Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const txt = await resp.text();
  if (!resp.ok) {
    console.error('[eventsub] createSubscription failed', resp.status, txt.slice(0, 500));
    throw new Error(`create sub ${resp.status}: ${txt}`);
  }
  try {
    const parsed = JSON.parse(txt);
    console.log('[eventsub] createSubscription success', parsed);
    return parsed;
  } catch (e) {
    throw new Error('createSubscription returned invalid JSON');
  }
}

async function ensureEventSubSubscriptions(broadcasterIds = []) {
  if (!EVENTSUB_SECRET) throw new Error('Missing TWITCH_EVENTSUB_SECRET');
  const token = await getAppTokenLocal();
  const existing = await listEventSubSubscriptions(token);
  const existingTopics = new Set(existing.map(s => (s.condition?.broadcaster_user_id || '') + '::' + (s.type || '')));

  const desired = [];
  for (const id of broadcasterIds) {
    desired.push({
      type: 'stream.online',
      version: '1',
      condition: { broadcaster_user_id: id },
      transport: {
        method: 'webhook',
        callback: `${BASE_URL.replace(/\/$/, '')}/api/twitch/eventsub`,
        secret: EVENTSUB_SECRET
      }
    });
    desired.push({
      type: 'stream.offline',
      version: '1',
      condition: { broadcaster_user_id: id },
      transport: {
        method: 'webhook',
        callback: `${BASE_URL.replace(/\/$/, '')}/api/twitch/eventsub`,
        secret: EVENTSUB_SECRET
      }
    });
  }

  const toCreate = desired.filter(d => {
    const key = d.condition.broadcaster_user_id + '::' + d.type;
    return !existingTopics.has(key);
  });

  if (toCreate.length === 0) return { createdCount: 0, createdSubs: [] };

  // create in parallel but limit concurrency slightly (Promise.all is OK here for small lists)
  const results = await Promise.allSettled(toCreate.map(d => createSubscription(d, token)));
  const created = [];
  const errors = [];
  results.forEach(r => {
    if (r.status === 'fulfilled') created.push(r.value);
    else errors.push(String(r.reason).slice(0, 500));
  });

  return { createdCount: created.length, createdSubs: created, errors };
}

// --- streaming cache refresh ---
async function refreshStreamsCache() {
  try {
    const accessToken = await getAppTokenLocal();
    const logins = Array.from(
      new Set(
        participants
          .map(p => (p.socialMedia && p.socialMedia.twitch ? String(p.socialMedia.twitch).toLowerCase() : null))
          .filter(Boolean)
      )
    );

    console.log('[eventsub] refreshStreamsCache: fetching streams for logins:', logins);

    if (logins.length === 0) {
      streamsCache = participants.map(p => ({ id: p.id, participant: p, stream: null }));
      const payload = { data: streamsCache, meta: { lastUpdated: Date.now(), source: 'fallback' } };
      safeWriteCacheAtomic(CACHE_FILE, payload);
      return streamsCache;
    }

    const usersUrl = `https://api.twitch.tv/helix/users?${logins.map(l => `login=${encodeURIComponent(l)}`).join('&')}`;
    const usersResp = await fetch(usersUrl, { headers: { 'Client-ID': CLIENT_ID, Authorization: `Bearer ${accessToken}` } });
    if (!usersResp.ok) {
      const t = await usersResp.text();
      throw new Error(`helix/users failed ${usersResp.status}: ${t.slice(0,200)}`);
    }
    const usersData = await usersResp.json();
    const idMap = new Map((usersData.data || []).map(u => [u.id, u.login.toLowerCase()]));
    const userIds = Array.from(idMap.keys());

    console.log('[eventsub] refreshStreamsCache: resolved userIds:', userIds);

    if (userIds.length === 0) {
      streamsCache = participants.map(p => ({ id: p.id, participant: p, stream: null }));
      const payload = { data: streamsCache, meta: { lastUpdated: Date.now(), source: 'noUserIds' } };
      safeWriteCacheAtomic(CACHE_FILE, payload);
      return streamsCache;
    }

    const streamsUrl = `https://api.twitch.tv/helix/streams?${userIds.map(id => `user_id=${encodeURIComponent(id)}`).join('&')}`;
    const streamsResp = await fetch(streamsUrl, { headers: { 'Client-ID': CLIENT_ID, Authorization: `Bearer ${accessToken}` } });
    if (!streamsResp.ok) {
      const t = await streamsResp.text();
      throw new Error(`helix/streams failed ${streamsResp.status}: ${t.slice(0,200)}`);
    }
    const streamsData = await streamsResp.json();

    console.log('[eventsub] refreshStreamsCache: helix/streams returned', (streamsData.data || []).length, 'streams');

    const streamByLogin = new Map();
    (streamsData.data || []).forEach(s => {
      const login = idMap.get(s.user_id);
      if (login) streamByLogin.set(login.toLowerCase(), s);
    });

    console.log('[eventsub] refreshStreamsCache: streamByLogin keys:', Array.from(streamByLogin.keys()));

    streamsCache = participants.map(p => {
      const login = p.socialMedia && p.socialMedia.twitch ? String(p.socialMedia.twitch).toLowerCase() : null;
      return { id: p.id, participant: p, stream: login ? (streamByLogin.get(login) || null) : null };
    });

    const payload = { data: streamsCache, meta: { lastUpdated: Date.now(), source: 'helix' } };
    safeWriteCacheAtomic(CACHE_FILE, payload);
    return streamsCache;
  } catch (err) {
    console.error('refreshStreamsCache error', String(err));
    // on error, try to keep the previous cache if present
    const existing = safeReadCache(CACHE_FILE);
    if (existing && Array.isArray(existing.data)) {
      console.log('[eventsub] refreshStreamsCache: keeping existing cache due to error');
      streamsCache = existing.data;
      return streamsCache;
    }

    // fallback only if no existing cache
    const fallback = participants.map(p => ({ id: p.id, participant: p, stream: null }));
    const payload = { data: fallback, meta: { lastUpdated: Date.now(), source: 'error', error: String(err) } };
    safeWriteCacheAtomic(CACHE_FILE, payload);
    streamsCache = fallback;
    return streamsCache;
  }
}

function safeCompare(a, b) {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch (e) {
    return false;
  }
}

function rawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // Admin route to ensure subscriptions exist
  if (req.method === 'GET' && req.query?.action === 'subscribe') {
    try {
      if (!CLIENT_ID || !CLIENT_SECRET || !EVENTSUB_SECRET || !BASE_URL) {
        return res.status(500).json({ error: 'Missing TWITCH_CLIENT_ID / TWITCH_CLIENT_SECRET / TWITCH_EVENTSUB_SECRET / BASE_URL' });
      }

      const logins = Array.from(new Set(
        participants.map(p => p.socialMedia && p.socialMedia.twitch ? String(p.socialMedia.twitch).toLowerCase() : null).filter(Boolean)
      ));

      if (logins.length === 0) return res.status(200).json({ message: 'No twitch logins found in participants' });

      const accessToken = await getAppTokenLocal();
      const usersUrl = `https://api.twitch.tv/helix/users?${logins.map(l => `login=${encodeURIComponent(l)}`).join('&')}`;
      const usersResp = await fetch(usersUrl, { headers: { 'Client-ID': CLIENT_ID, Authorization: `Bearer ${accessToken}` } });
      if (!usersResp.ok) {
        const t = await usersResp.text();
        return res.status(500).json({ error: `helix/users failed ${usersResp.status}`, details: t.slice(0,500) });
      }
      const usersData = await usersResp.json();
      const userIds = (usersData.data || []).map(u => u.id);
      if (userIds.length === 0) return res.status(200).json({ message: 'No user ids found for given logins' });

      const result = await ensureEventSubSubscriptions(userIds);
      return res.status(200).json({ ok: true, result });
    } catch (err) {
      console.error('subscribe action error', String(err));
      return res.status(500).json({ error: String(err) });
    }
  }

  // Admin route pour debug cache: renvoie le chemin du cache et un aperçu si présent
  if (req.method === 'GET' && req.query?.action === 'cachepath') {
    try {
      const exists = fs.existsSync(CACHE_FILE);
      let preview = null;
      if (exists) {
        const raw = fs.readFileSync(CACHE_FILE, 'utf8');
        preview = raw.slice(0, 4000);
      }
      return res.status(200).json({ cacheFile: CACHE_FILE, exists, preview });
    } catch (err) {
      return res.status(500).json({ error: String(err) });
    }
  }

  // Admin route to list current EventSub subscriptions (for debugging)
  if (req.method === 'GET' && req.query?.action === 'list') {
    try {
      if (!CLIENT_ID || !CLIENT_SECRET) return res.status(500).json({ error: 'Missing TWITCH_CLIENT_ID / TWITCH_CLIENT_SECRET' });
      const token = await getAppTokenLocal();
      const subs = await listEventSubSubscriptions(token);
      return res.status(200).json({ ok: true, total: subs.length, data: subs });
    } catch (err) {
      console.error('list action error', String(err));
      return res.status(500).json({ error: String(err) });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Handle EventSub POSTs
  try {
    const bodyText = await rawBody(req);
    const msgId = req.headers['twitch-eventsub-message-id'] || req.headers['Twitch-Eventsub-Message-Id'] || req.headers['twitch-eventsub-message-id'];
    const msgTimestamp = req.headers['twitch-eventsub-message-timestamp'] || req.headers['Twitch-Eventsub-Message-Timestamp'];
    const msgSig = req.headers['twitch-eventsub-message-signature'] || req.headers['Twitch-Eventsub-Message-Signature'];
    const msgType = req.headers['twitch-eventsub-message-type'] || req.headers['Twitch-Eventsub-Message-Type'];

    if (!msgId || !msgTimestamp || !msgSig || !msgType) {
      return res.status(400).json({ error: 'Missing EventSub headers' });
    }

    const computed = 'sha256=' + crypto.createHmac('sha256', EVENTSUB_SECRET || '').update(msgId + msgTimestamp + bodyText).digest('hex');
    if (!safeCompare(computed, msgSig)) {
      console.warn('Invalid signature', { computed, msgSig });
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const payload = JSON.parse(bodyText || '{}');

    if (msgType === 'webhook_callback_verification') {
      // Twitch expects plain text challenge
      const challenge = payload.challenge;
      console.log('[eventsub] webhook_callback_verification received for subscription', payload.subscription?.type);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(challenge);
    }

    if (msgType === 'notification') {
      // Only refresh cache and return 200; do not recreate subscriptions here
      try {
        console.log('[eventsub] notification received, subscription:', payload.subscription?.type, 'event:', payload.event);
        await refreshStreamsCache();
        console.log('[eventsub] cache refreshed after notification');
      } catch (e) {
        console.error('refreshStreamsCache error', String(e));
      }
      return res.status(200).json({ received: true });
    }

    if (msgType === 'revocation') {
      console.warn('EventSub revoked', payload);
      return res.status(200).json({ revoked: true });
    }

    return res.status(400).json({ error: 'Unknown message type' });
  } catch (err) {
    console.error('eventsub handler error', String(err));
    return res.status(500).json({ error: String(err) });
  }
}