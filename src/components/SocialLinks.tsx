import React from "react";
import { Social, SocialType } from '../data/participants';

const META: Record<SocialType, { short: string; bg: string; label: string; url: (v: string) => string }> = {
  twitch: { short: 'Tw', bg: '#7b4ea8', label: 'Twitch', url: (v) => `https://twitch.tv/${v}` },
  youtube: { short: 'YT', bg: '#c0392b', label: 'YouTube', url: (v) => `https://youtube.com/${v}` },
  tiktok: { short: 'TT', bg: '#1f1f1f', label: 'TikTok', url: (v) => `https://tiktok.com/${v}` },
  twitter: { short: 'X', bg: '#2a2a2a', label: 'X', url: (v) => `https://x.com/${v.replace('@', '')}` },
  web: { short: '↗', bg: '#5fb6c4', label: 'Site', url: (v) => `https://${v.replace(/^https?:\/\//, '')}` },
};

export function SocialLinks({ socials }: { socials: Social[] }) {
  return (
    <div style={{ display: 'flex', gap: 7, justifyContent: 'center', flexWrap: 'wrap' }}>
      {socials.map((s, i) => {
        const m = META[s.type];
        return (
          <a key={i} href={m.url(s.value)} target="_blank" rel="noopener noreferrer" title={m.label} className="v-soc"
            style={{
              width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Press Start 2P', sans-serif", fontSize: 9, color: '#fff', textDecoration: 'none',
              background: m.bg, border: '3px solid rgba(0,0,0,.35)', borderRadius: 5,
              boxShadow: 'inset -2px -2px 0 rgba(0,0,0,.25), inset 2px 2px 0 rgba(255,255,255,.25)',
            }}>{m.short}</a>
        );
      })}
    </div>
  );
}
