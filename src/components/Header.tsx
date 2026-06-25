import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { C, FONT } from '../theme';
import React from "react";

const NAV: [string, string][] = [
  ['À propos', '#about'],
  ['Le Monde', '#monde'],
  ['Planning', '#planning'],
  ['Streams', '#streams'],
  ['Aventuriers', '#participants'],
  ['Règles', '#regles'],
];

const HEADER_HEIGHT = 71; // padding(10) + logo(46) + padding(10) + border(5)

export function Header({ ip }: { ip: string }) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const copy = () => {
    try { navigator.clipboard.writeText(ip); } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Escape ferme le menu
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Focus trap dans le menu mobile
  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;
    const focusable = Array.from(
      menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    );
    focusable[0]?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first?.focus();
      }
    };
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  const navLinkStyle = {
    fontFamily: FONT.pixel,
    fontSize: 16,
    color: C.cream,
    textDecoration: 'none',
    padding: '7px 12px',
  } as const;

  return (
    <>
      <nav
        aria-label="Navigation principale"
        style={{
          position: 'sticky', top: 0, zIndex: 60, display: 'flex', alignItems: 'center', gap: 18,
          padding: '10px 26px',
          background: `linear-gradient(${C.woodBar1}, ${C.woodBar2})`,
          borderBottom: `5px solid ${C.woodDark}`,
          boxShadow: '0 4px 0 rgba(58,42,24,.4), 0 8px 18px rgba(0,0,0,.3)',
        }}
      >
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <img
            src="/logo_virtualia.png" alt="Virtualia" width={46} height={46}
            style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 3px 0 rgba(0,0,0,.35))' }}
          />
          <span style={{ fontFamily: FONT.pixel, fontWeight: 700, fontSize: 26, color: C.cream, textShadow: '3px 3px 0 #2e1a0e', letterSpacing: 1 }}>
            VIRTUALIA
          </span>
        </a>
        <div style={{ flex: 1 }} />

        {/* Navigation desktop — cachée sur mobile */}
        <div className="hidden md:flex items-center" style={{ gap: 6 }}>
          {NAV.map(([label, href]) => (
            <a key={href} href={href} className="v-nav" style={navLinkStyle}>{label}</a>
          ))}
          <button
            onClick={copy}
            className="v-btn"
            style={{
              fontFamily: FONT.pixel, fontSize: 16, color: '#fff', cursor: 'pointer',
              marginLeft: 6, padding: '9px 16px',
              background: `linear-gradient(${C.grass}, ${C.grassDark})`,
              border: `3px solid ${C.grassBorder}`, borderRadius: 4,
              boxShadow: 'inset -3px -3px 0 rgba(0,0,0,.25), inset 3px 3px 0 rgba(255,255,255,.35), 0 4px 0 #2e4a18',
            }}
          >
            {copied ? 'Copié ✓' : 'Copier IP'}
          </button>
        </div>

        {/* Bouton hamburger — visible sur mobile uniquement */}
        <button
          ref={hamburgerRef}
          className="flex md:hidden items-center justify-center"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.cream, padding: 4 }}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Menu mobile */}
      {menuOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          role="navigation"
          aria-label="Navigation principale"
          className="flex md:hidden flex-col"
          style={{
            position: 'fixed', top: HEADER_HEIGHT, left: 0, right: 0, zIndex: 59,
            background: `linear-gradient(${C.woodBar1}, ${C.woodBar2})`,
            borderBottom: `4px solid ${C.woodDark}`,
            boxShadow: '0 8px 24px rgba(0,0,0,.4)',
          }}
        >
          {NAV.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className="v-nav"
              style={{
                ...navLinkStyle,
                padding: '16px 26px',
                fontSize: 18,
                borderBottom: '1px solid rgba(255,255,255,.08)',
              }}
            >
              {label}
            </a>
          ))}
          <button
            onClick={() => { copy(); closeMenu(); }}
            className="v-btn"
            style={{
              fontFamily: FONT.pixel, fontSize: 16, color: '#fff', cursor: 'pointer',
              margin: 16, padding: '12px 20px',
              background: `linear-gradient(${C.grass}, ${C.grassDark})`,
              border: `3px solid ${C.grassBorder}`, borderRadius: 4,
              boxShadow: 'inset -3px -3px 0 rgba(0,0,0,.25), inset 3px 3px 0 rgba(255,255,255,.35), 0 4px 0 #2e4a18',
            }}
          >
            {copied ? 'Copié ✓' : 'Copier IP'}
          </button>
        </div>
      )}
    </>
  );
}
