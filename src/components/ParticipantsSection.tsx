import type { CSSProperties } from 'react';
import { C, FONT } from '../theme';
import { participants, twitchLogin, ROLE_META, Role, Participant } from '../data/participants';
import { StarlightPoseSkin } from './StarlightPoseSkin';
import { SocialLinks } from './SocialLinks';
import React from "react";

interface Props { liveLogins: string[]; }

const ORDER: Role[] = ['creatrice', 'modo', 'participant'];

const dotted: CSSProperties = { background: '#e2d4b2', backgroundImage: 'radial-gradient(rgba(58,42,24,.05) 2px, transparent 2px)', backgroundSize: '22px 22px' };

export function ParticipantsSection({ liveLogins }: Props) {
  const groups = ORDER.map((role) => ({
    role,
    meta: ROLE_META[role],
    people: participants.filter((p) => p.role === role),
  })).filter((g) => g.people.length > 0);

  let globalIndex = 0;

  return (
    <section id="participants" style={{ padding: '90px 20px', ...dotted }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontFamily: FONT.pixel, fontWeight: 700, fontSize: 'clamp(38px,6vw,64px)', margin: '0 0 12px', color: C.ink, textShadow: '3px 3px 0 #c9b78d' }}>⚔ Les Aventuriers</h2>
          <p style={{ fontSize: 18, color: '#4a3a25', maxWidth: 720, margin: '0 auto' }}>{participants.length} VTubers réunis sur Virtualia. Survolez une carte pour découvrir leurs réseaux.</p>
        </div>

        {groups.map((g) => (
          <div key={g.role} style={{ marginBottom: 44 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <span style={{ fontFamily: FONT.pixel, fontSize: 30, color: C.ink }}>{g.meta.label}</span>
              <span style={{ flex: 1, height: 5, background: 'repeating-linear-gradient(90deg,#3a2a18 0 8px,transparent 8px 16px)', opacity: 0.4 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 20 }}>
              {g.people.map((p: Participant) => {
                const login = twitchLogin(p);
                const isLive = !!login && liveLogins.includes(login);
                const idx = globalIndex++;
                return (
                  <div key={p.name} className="v-lift" style={{
                    position: 'relative', background: C.parchmentLight, border: `4px solid ${C.woodDark}`, borderRadius: 8,
                    padding: '16px 14px 14px', textAlign: 'center', overflow: 'hidden',
                    boxShadow: 'inset -4px -4px 0 rgba(58,42,24,.14), inset 4px 4px 0 rgba(255,255,255,.6), 0 6px 0 rgba(58,42,24,.3)',
                  }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 7, background: g.meta.accent }} />
                    {isLive && (
                      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 3, fontFamily: FONT.arcade, fontSize: 7, color: '#fff', background: C.red, padding: '5px 6px', borderRadius: 3, animation: 'v-pulseLive 1.6s infinite' }}>● LIVE</div>
                    )}
                    <div style={{ height: 170, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', margin: '6px 0 10px', background: `radial-gradient(ellipse at bottom, ${g.meta.accent}66, transparent 70%)` }}>
                      <StarlightPoseSkin username={p.pseudo} poseIndex={idx} />
                    </div>
                    <h3 style={{ fontFamily: FONT.pixel, fontSize: 21, margin: '0 0 2px', color: C.ink, wordBreak: 'break-word' }}>{p.name}</h3>
                    <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#8a7350', margin: '0 0 12px' }}>{p.pseudo}</p>
                    <SocialLinks socials={p.socials} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
