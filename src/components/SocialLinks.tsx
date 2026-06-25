import React from "react";
import { Social, SocialType } from '../data/participants';

const TwitchIcon = () => (
  <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor" aria-hidden="true">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.19a8.22 8.22 0 0 0 4.81 1.54V6.28a4.85 4.85 0 0 1-1.04-.41z" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx={12} cy={12} r={10} />
    <line x1={2} y1={12} x2={22} y2={12} />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

type IconFC = () => React.JSX.Element;
type MetaEntry = { Icon: IconFC; bg: string; label: string; url: (v: string) => string };

const META: Record<SocialType, MetaEntry> = {
  twitch:  { Icon: TwitchIcon,  bg: '#7b4ea8', label: 'Twitch',  url: (v) => `https://twitch.tv/${v}` },
  youtube: { Icon: YouTubeIcon, bg: '#c0392b', label: 'YouTube', url: (v) => `https://youtube.com/${v}` },
  twitter: { Icon: XIcon,       bg: '#2a2a2a', label: 'X',       url: (v) => `https://x.com/${v.replace('@', '')}` },
  tiktok:  { Icon: TikTokIcon,  bg: '#1a1a1a', label: 'TikTok',  url: (v) => `https://tiktok.com/${v}` },
  web:     { Icon: GlobeIcon,   bg: '#5fb6c4', label: 'Site',    url: (v) => `https://${v.replace(/^https?:\/\//, '')}` },
};

export function SocialLinks({ socials }: { socials: Social[] }) {
  return (
    <div style={{ display: 'flex', gap: 7, justifyContent: 'center', flexWrap: 'wrap' }}>
      {socials.map((s, i) => {
        const m: MetaEntry | undefined = META[s.type as SocialType];
        if (!m) return null;
        return (
          <a
            key={i}
            href={m.url(s.value)}
            target="_blank"
            rel="noopener noreferrer"
            title={m.label}
            aria-label={`${m.label} : ${s.value}`}
            className="v-soc"
            style={{
              width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', textDecoration: 'none',
              background: m.bg, border: '3px solid rgba(0,0,0,.35)', borderRadius: 5,
              boxShadow: 'inset -2px -2px 0 rgba(0,0,0,.25), inset 2px 2px 0 rgba(255,255,255,.25)',
            }}
          >
            <m.Icon />
          </a>
        );
      })}
    </div>
  );
}
