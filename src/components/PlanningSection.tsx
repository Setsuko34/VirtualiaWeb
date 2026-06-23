import React from "react";
import { C, FONT, panel } from '../theme';
import type { CSSProperties } from 'react';

const PLANNING = [
  // TODO: remplacer les dates "À venir" par les vraies dates de la saison
  { tag: 'OPEN', col: '#76ad44', when: 'Jour J', title: 'Ouverture du serveur', desc: 'Lancement officiel de la Saison 3, tous en stream !' },
  { tag: 'EVENT', col: '#a55fd0', when: 'Hebdo', title: 'Soirée événement', desc: 'Mini-jeux, build battles et défis communautaires.' },
  { tag: 'BOSS', col: '#c2552a', when: 'À venir', title: 'Raid de boss', desc: 'Affrontez un boss Dragonfyre en équipe.' },
  { tag: 'STREAM', col: '#7b4ea8', when: 'Quotidien', title: 'Aventures solo', desc: 'Chaque VTuber avance son histoire en live.' },
  { tag: 'FINAL', col: '#e0a435', when: 'Fin de saison', title: 'Grand final', desc: 'Clôture épique de la saison en multistream.' },
];

const dotted: CSSProperties = { background: '#e7dabb', backgroundImage: 'radial-gradient(rgba(58,42,24,.05) 2px, transparent 2px)', backgroundSize: '22px 22px' };

export function PlanningSection() {
  return (
    <section id="planning" style={{ padding: '90px 20px', ...dotted }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 46 }}>
          <h2 style={{ fontFamily: FONT.pixel, fontWeight: 700, fontSize: 'clamp(38px,6vw,64px)', margin: '0 0 12px', color: C.ink, textShadow: '3px 3px 0 #c9b78d' }}>📅 Planning de la Saison</h2>
          <p style={{ fontSize: 17, color: '#4a3a25' }}>Les grands rendez-vous communautaires. <em>Horaires indicatifs — à ajuster.</em></p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>
          {PLANNING.map((e) => (
            <div key={e.title} className="v-lift" style={{ padding: 20, ...panel(C.parchmentLight)}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontFamily: FONT.arcade, fontSize: 9, color: '#fff', background: e.col, padding: '6px 8px', borderRadius: 3, border: '2px solid rgba(0,0,0,.3)' }}>{e.tag}</span>
                <span style={{ fontFamily: FONT.pixel, fontSize: 16, color: C.wood }}>{e.when}</span>
              </div>
              <h3 style={{ fontFamily: FONT.pixel, fontSize: 22, margin: '0 0 6px', color: C.ink }}>{e.title}</h3>
              <p style={{ fontSize: 14, color: C.inkSoft, lineHeight: 1.5, margin: 0 }}>{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
