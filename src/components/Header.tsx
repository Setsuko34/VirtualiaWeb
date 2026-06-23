import { useState } from 'react';
import { C, FONT } from '../theme';
import React from "react";

const NAV = [
  ['À propos', '#about'],
  ['Le Monde', '#monde'],
  ['Planning', '#planning'],
  ['Streams', '#streams'],
  ['Aventuriers', '#participants'],
  ['Règles', '#regles'],
];

export function Header({ ip }: { ip: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try { navigator.clipboard.writeText(ip); } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 60, display: 'flex', alignItems: 'center', gap: 18,
      padding: '10px 26px', background: `linear-gradient(${C.woodBar1}, ${C.woodBar2})`,
      borderBottom: `5px solid ${C.woodDark}`, boxShadow: '0 4px 0 rgba(58,42,24,.4), 0 8px 18px rgba(0,0,0,.3)',
    }}>
      <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
        <img src="/logo_virtualia.png" alt="Virtualia" width={46} height={46}
          style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 3px 0 rgba(0,0,0,.35))' }} />
        <span style={{ fontFamily: FONT.pixel, fontWeight: 700, fontSize: 26, color: C.cream, textShadow: '3px 3px 0 #2e1a0e', letterSpacing: 1 }}>VIRTUALIA</span>
      </a>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        {NAV.map(([label, href]) => (
          <a key={href} href={href} className="v-nav"
            style={{ fontFamily: FONT.pixel, fontSize: 16, color: C.cream, textDecoration: 'none', padding: '7px 12px' }}>
            {label}
          </a>
        ))}
        <button onClick={copy} className="v-btn" style={{
          fontFamily: FONT.pixel, fontSize: 16, color: '#fff', cursor: 'pointer', marginLeft: 6, padding: '9px 16px',
          background: `linear-gradient(${C.grass}, ${C.grassDark})`, border: `3px solid ${C.grassBorder}`, borderRadius: 4,
          boxShadow: 'inset -3px -3px 0 rgba(0,0,0,.25), inset 3px 3px 0 rgba(255,255,255,.35), 0 4px 0 #2e4a18',
        }}>{copied ? 'Copié ✓' : 'Copier IP'}</button>
      </div>
    </nav>
  );
}
