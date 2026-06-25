import { useEffect, useRef } from 'react';
import { C, FONT } from '../theme';
import React from "react";

interface Props { open: boolean; onClose: () => void; }

export function OldMapModal({ open, onClose }: Props) {
  const firstFocusableRef = useRef<HTMLAnchorElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Sauvegarder le focus actuel à l'ouverture, le restaurer à la fermeture
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => firstFocusableRef.current?.focus(), 0);
    } else {
      previousFocusRef.current?.focus();
    }
  }, [open]);

  // Escape ferme la modale
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Focus trap : Tab/Shift+Tab restent dans la modale
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const first = firstFocusableRef.current;
    const last = lastFocusableRef.current;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first?.focus();
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        style={{ background: C.parchmentLight, border: `5px solid ${C.woodDark}`, borderRadius: 8, padding: 28, width: 380, maxWidth: '100%', boxShadow: 'inset -5px -5px 0 rgba(58,42,24,.15), inset 5px 5px 0 rgba(255,255,255,.6), 0 10px 0 rgba(0,0,0,.4)' }}
      >
        <h3 id="modal-title" style={{ fontFamily: FONT.pixel, fontSize: 26, margin: '0 0 16px', color: C.ink }}>
          ⬇ Anciennes maps
        </h3>
        <a
          ref={firstFocusableRef}
          href="https://drive.google.com/file/d/1wBcGYWbpz99oU99GB7YlmBs91TOegZS8/view"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT.pixel, fontSize: 18, color: C.ink, textDecoration: 'none', padding: 14, background: C.parchment, border: `3px solid ${C.wood}`, borderRadius: 5, marginBottom: 12 }}
        >
          📦 Saison 1
        </a>
        <p style={{ fontSize: 13, color: '#8a7350', margin: '0 0 18px' }}>Les maps des saisons suivantes seront ajoutées ici.</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            ref={lastFocusableRef}
            onClick={onClose}
            className="v-btn"
            style={{ cursor: 'pointer', fontFamily: FONT.pixel, fontSize: 16, color: '#fff', padding: '9px 18px', background: '#9a4a3a', border: '3px solid #5e2418', borderRadius: 4, boxShadow: 'inset -2px -2px 0 rgba(0,0,0,.25), inset 2px 2px 0 rgba(255,255,255,.25)' }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
