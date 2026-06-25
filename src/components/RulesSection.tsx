import React from "react";
import { C, FONT } from '../theme';

const RULES = [
  { n: '01', title: 'Respect avant tout', desc: "Aucun harcèlement, propos haineux ou toxicité. On est là pour s'amuser ensemble." },
  { n: '02', title: 'Pas de grief', desc: 'Ne détruis ni ne vole les constructions des autres joueurs.' },
  { n: '03', title: 'Jeu loyal', desc: 'Interdiction des hacks, x-ray, duplication de bugs et exploits.' },
  { n: '04', title: 'Esprit collaboratif', desc: 'Le monde est partagé : entraidez-vous et construisez ensemble.' },
  { n: '05', title: 'Contenu en stream', desc: 'Pense à tes viewers : reste fair-play et bienveillant à l\'antenne.' },
  { n: '06', title: 'Écoute les modos', desc: 'Les modérateurs sont là pour t\'aider. Suis leurs consignes.' },
];

export function RulesSection() {
  return (
    <section id="regles" className="px-5 py-10 md:py-[90px]" style={{ background: 'linear-gradient(#2c3a2a,#1f2b22)', color: '#e7dabb' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 46 }}>
          <h2 style={{ fontFamily: FONT.pixel, fontWeight: 700, fontSize: 'clamp(38px,6vw,64px)', margin: '0 0 12px', color: C.cream, textShadow: '3px 3px 0 #000' }}>📖 Règles du Royaume</h2>
          <p style={{ fontSize: 17, color: '#c7bb98' }}>Pour que l'aventure reste fun pour tout le monde.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 18 }}>
          {RULES.map((r) => (
            <div key={r.n} className="v-row" style={{ display: 'flex', gap: 14, background: 'rgba(255,255,255,.06)', border: `3px solid ${C.wood}`, borderRadius: 6, padding: 18 }}>
              <div style={{ fontFamily: FONT.pixel, fontSize: 30, color: C.grass, flex: 'none', lineHeight: 1 }}>{r.n}</div>
              <div>
                <h3 style={{ fontFamily: FONT.pixel, fontSize: 21, margin: '0 0 5px', color: C.cream }}>{r.title}</h3>
                <p style={{ fontSize: 14, color: '#bdb293', lineHeight: 1.5, margin: 0 }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
