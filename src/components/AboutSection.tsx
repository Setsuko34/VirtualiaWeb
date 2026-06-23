import React from "react";
import { C, FONT, panel } from '../theme';
import type { CSSProperties } from 'react';

const FEATURES = [
  { icon: '🐲', bg: '#e0772c', title: 'Dragonfyre', desc: "Cisco's Medieval RPG enrichi de dizaines de mods custom." },
  { icon: '💜', bg: '#a55fd0', title: '100% VTubers', desc: 'Une communauté exclusive de créateurs VTuber francophones.' },
  { icon: '⚔️', bg: '#76ad44', title: 'Aventure RPG', desc: 'Classes, magie, donjons, raids et boss légendaires.' },
  { icon: '🌍', bg: '#5fb6c4', title: 'Monde partagé', desc: 'Explorez, construisez et collaborez dans un univers persistant.' },
];

const dotted: CSSProperties = {
  background: '#e7dabb', backgroundImage: 'radial-gradient(rgba(58,42,24,.05) 2px, transparent 2px)', backgroundSize: '22px 22px',
};

export function AboutSection() {
  return (
    <section id="about" style={{ position: 'relative', padding: '90px 20px', ...dotted }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 54 }}>
          <h2 style={{ fontFamily: FONT.pixel, fontWeight: 700, fontSize: 'clamp(38px,6vw,64px)', margin: '0 0 14px', color: C.ink, textShadow: '3px 3px 0 #c9b78d' }}>Bienvenue sur Virtualia</h2>
          <p style={{ fontSize: 19, color: '#4a3a25', maxWidth: 760, margin: '0 auto', lineHeight: 1.6 }}>Virtualia est un serveur Minecraft privé qui réunit les VTubers francophones dans une grande aventure RPG médiévale. Saison 3 : un monde tout neuf bâti sur <strong>Dragonfyre</strong> et une montagne de mods custom.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 22, marginBottom: 48 }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="v-lift" style={{ padding: 24, ...panel()}}>
              <div style={{ width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, background: f.bg, border: `3px solid ${C.woodDark}`, borderRadius: 5, boxShadow: 'inset -3px -3px 0 rgba(0,0,0,.2), inset 3px 3px 0 rgba(255,255,255,.3)', marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: FONT.pixel, fontSize: 24, margin: '0 0 8px', color: C.ink }}>{f.title}</h3>
              <p style={{ fontSize: 15, color: C.inkSoft, lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: '38px 40px', ...panel(C.parchmentLight, 5) }}>
          <h3 style={{ fontFamily: FONT.pixel, fontSize: 30, margin: '0 0 18px', color: C.ink }}>📜 Le Concept de la Saison 3</h3>
          <p style={{ fontSize: 16, color: '#4a3a25', lineHeight: 1.7, margin: '0 0 14px' }}>Après deux saisons mémorables, Virtualia repart de zéro sur un monde médiéval-fantasy entièrement neuf. Le modpack <strong>Cisco's Medieval RPG · Dragonfyre</strong>, gonflé de mods custom, transforme le serveur en véritable terrain de jeu RPG : classes, magie, donjons, raids et boss légendaires.</p>
          <p style={{ fontSize: 16, color: '#4a3a25', lineHeight: 1.7, margin: 0 }}>Chaque VTuber forge sa propre légende et participe à l'histoire collective du royaume. Suivez leurs streams, regardez-les bâtir, combattre et collaborer dans cet univers persistant.</p>
        </div>
      </div>
    </section>
  );
}
