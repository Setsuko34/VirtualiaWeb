import React from "react";
import { C, FONT } from '../theme';

export function Footer({ onOpenMap, onOpenCredits }: { onOpenMap: () => void; onOpenCredits: () => void }) {
  return (
    <footer style={{ background: `linear-gradient(${C.woodBar2}, ${C.woodDark})`, color: '#e7dabb', padding: '54px 20px 30px', borderTop: '6px solid #2e1a0e' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 30, justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ maxWidth: 340 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <img src="/logo_virtualia.png" width={42} height={42} alt="Virtualia" style={{ imageRendering: 'pixelated' }} />
            <span style={{ fontFamily: FONT.pixel, fontSize: 26, color: C.cream, textShadow: '2px 2px 0 #2e1a0e' }}>VIRTUALIA</span>
          </div>
          <p style={{ fontSize: 14, color: '#cbbb95', lineHeight: 1.6, margin: 0 }}>Le serveur Minecraft événementiel des VTubers francophones · Saison 3 · Modpack Dragonfyre.</p>
        </div>
        <div>
          <h4 style={{ fontFamily: FONT.pixel, fontSize: 20, margin: '0 0 12px', color: C.cream }}>Archives</h4>
          <button onClick={onOpenMap} className="v-btn" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONT.pixel, fontSize: 16, color: '#fff', padding: '10px 16px', background: C.grass, border: `3px solid ${C.grassBorder}`, borderRadius: 4, boxShadow: 'inset -2px -2px 0 rgba(0,0,0,.25), inset 2px 2px 0 rgba(255,255,255,.3)' }}>⬇ Télécharger les anciennes maps</button>
        </div>
        <div>
          <h4 style={{ fontFamily: FONT.pixel, fontSize: 20, margin: '0 0 12px', color: C.cream }}>À propos</h4>
          <button onClick={onOpenCredits} className="v-btn" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONT.pixel, fontSize: 16, color: '#fff', padding: '10px 16px', background: C.amethyst, border: `3px solid ${C.amethystBorder}`, borderRadius: 4, boxShadow: 'inset -2px -2px 0 rgba(0,0,0,.25), inset 2px 2px 0 rgba(255,255,255,.3)' }}>✨ Crédits</button>
        </div>
        <div>
          <h4 style={{ fontFamily: FONT.pixel, fontSize: 20, margin: '0 0 12px', color: C.cream }}>Communauté</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* TODO: remplacer # par le vrai lien Discord */}
            <a href="#" style={{ fontSize: 15, color: '#cbbb95', textDecoration: 'none' }}>💬 Discord</a>
            <a href="https://twitch.tv/vtyukiuwu" target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, color: '#cbbb95', textDecoration: 'none' }}>🟣 Twitch · VTYukiUwU</a>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: '34px auto 0', paddingTop: 20, borderTop: '2px solid rgba(255,255,255,.12)', textAlign: 'center', fontSize: 13, color: '#b3a17e' }}>
        Organisation : VTYukiUwU · Design &amp; Dev : Setsuko_Aka — © Virtualia 2026
      </div>
    </footer>
  );
}
