import React from "react";
import { C, FONT } from '../theme';

const BIOMES = [
  { icon: '🌲', col: '#4d7a3a', name: 'Forêts enchantées', desc: 'Villages, herboristerie et créatures magiques.' },
  { icon: '🏰', col: '#8a6a3a', name: 'Donjons oubliés', desc: 'Pièges, butins rares et gardiens à vaincre.' },
  { icon: '🌋', col: '#c2552a', name: 'Terres de feu', desc: 'Le repaire des dragons. Réservé aux plus braves.' },
  { icon: '❄️', col: '#5a8fb0', name: 'Pics gelés', desc: 'Ressources rares cachées sous la glace éternelle.' },
];

export function WorldSection() {
  return (
    <section id="monde" className="px-5 py-10 md:py-[90px]" style={{ position: 'relative', background: 'linear-gradient(#2c3a2a,#1f2b22)', color: '#e7dabb', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.07, backgroundImage: 'repeating-linear-gradient(45deg,#fff 0 2px,transparent 2px 14px)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1140, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', fontFamily: FONT.arcade, fontSize: 10, color: C.ember, border: `3px solid ${C.ember}`, borderRadius: 4, padding: '8px 12px', marginBottom: 18 }}>🐉 DRAGONFYRE</div>
          <h2 style={{ fontFamily: FONT.pixel, fontWeight: 700, fontSize: 'clamp(38px,6vw,64px)', margin: '0 0 12px', color: C.cream, textShadow: '3px 3px 0 #000' }}>Le Monde de Virtualia</h2>
          <p style={{ fontSize: 18, color: '#c7bb98', maxWidth: 740, margin: '0 auto', lineHeight: 1.6 }}>Un royaume médiéval vivant à explorer : forêts enchantées, donjons oubliés, volcans gardés par les dragons. Chaque biome cache ses quêtes, ses dangers et ses trésors.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-[30px]">
          {/* TODO: intégrer iframe BlueMap / unmined ici */}
          <div style={{ position: 'relative', border: `5px solid ${C.wood}`, borderRadius: 8, overflow: 'hidden', minHeight: 340, boxShadow: '0 8px 0 rgba(0,0,0,.4)', background: 'repeating-linear-gradient(45deg,#3a4a38 0 16px,#43543f 16px 32px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: '#bfcbb0' }}>
              <div style={{ fontSize: 46 }}>🗺️</div>
              <div style={{ fontFamily: FONT.pixel, fontSize: 22, marginTop: 6 }}>Carte du monde</div>
              <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#8ba07e', marginTop: 6 }}>[ intégrer BlueMap / render ici ]</div>
            </div>
            <div style={{ position: 'absolute', top: 14, left: 14, fontFamily: FONT.arcade, fontSize: 9, background: 'rgba(0,0,0,.67)', color: '#fff', padding: '6px 8px', borderRadius: 3 }}>SAISON 3</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {BIOMES.map((b) => (
              <div key={b.name} className="v-row" style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,.06)', border: `3px solid ${b.col}`, borderRadius: 6, padding: '14px 16px' }}>
                <div style={{ fontSize: 26, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: b.col, borderRadius: 5, flex: 'none' }}>{b.icon}</div>
                <div>
                  <div style={{ fontFamily: FONT.pixel, fontSize: 20, color: C.cream }}>{b.name}</div>
                  <div style={{ fontSize: 14, color: '#bdb293', lineHeight: 1.4 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
