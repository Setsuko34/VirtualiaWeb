import { useEffect, useRef } from 'react';
import { C, FONT } from '../theme';
import React from "react";

interface Props { open: boolean; onClose: () => void; }

const credits = [
  { role: 'Développement du site', name: 'Setsuko_Aka', icon: '💻' },
  { role: 'Logo', name: 'Lhinari', icon: '🎨' },
  { role: 'Organisation', name: 'VTYukiUwU', icon: '👑' },
];

export function CreditsModal({ open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => closeRef.current?.focus(), 0);
    } else {
      previousFocusRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="credits-title"
        onClick={(e) => e.stopPropagation()}
        style={{ background: C.parchmentLight, border: `5px solid ${C.woodDark}`, borderRadius: 8, padding: '28px 32px', width: 400, maxWidth: '100%', boxShadow: 'inset -5px -5px 0 rgba(58,42,24,.15), inset 5px 5px 0 rgba(255,255,255,.6), 0 10px 0 rgba(0,0,0,.4)' }}
      >
        <h3 id="credits-title" style={{ fontFamily: FONT.pixel, fontSize: 24, margin: '0 0 20px', color: C.ink, textAlign: 'center' }}>
          ✨ Crédits
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {credits.map(({ role, name, icon }) => (
            <div
              key={name}
              style={{ display: 'flex', alignItems: 'center', gap: 14, background: C.parchment, border: `3px solid ${C.wood}`, borderRadius: 5, padding: '12px 16px', boxShadow: 'inset -2px -2px 0 rgba(58,42,24,.1), inset 2px 2px 0 rgba(255,255,255,.5)' }}
            >
              <span style={{ fontSize: 26, lineHeight: 1 }}>{icon}</span>
              <div>
                <div style={{ fontFamily: FONT.pixel, fontSize: 16, color: C.ink }}>{name}</div>
                <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 2 }}>{role}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            ref={closeRef}
            onClick={onClose}
            className="v-btn"
            style={{ cursor: 'pointer', fontFamily: FONT.pixel, fontSize: 16, color: '#fff', padding: '9px 24px', background: C.amethyst, border: `3px solid ${C.amethystBorder}`, borderRadius: 4, boxShadow: 'inset -2px -2px 0 rgba(0,0,0,.25), inset 2px 2px 0 rgba(255,255,255,.25)' }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
