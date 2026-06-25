import { C, FONT } from '../theme';
import { LiveStream, twitchEmbed } from '../hooks/useStreams';
import React from "react";

interface Props { streams: LiveStream[]; loading: boolean; }

export function StreamsSection({ streams, loading }: Props) {
  const multistreamUrl = streams.length
    ? 'https://www.multitwitch.tv/' + streams.map((s) => encodeURIComponent(s.login)).join('/')
    : 'https://www.multitwitch.tv';

  return (
    <section id="streams" className="px-5 py-10 md:py-[90px]" style={{ position: 'relative', background: 'linear-gradient(#3a2150,#241433)', color: C.cream, overflow: 'hidden' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontFamily: FONT.pixel, fontWeight: 700, fontSize: 'clamp(38px,6vw,64px)', margin: '0 0 12px', color: '#fff', textShadow: '3px 3px 0 #000' }}>🔴 Streams en Direct</h2>
          <p style={{ fontSize: 18, color: '#cbb6e0', maxWidth: 720, margin: '0 auto' }}>Regardez les aventuriers de Virtualia en action, en temps réel sur Twitch.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,.05)', border: `3px dashed ${C.amethyst}`, borderRadius: 8 }}>
            <div style={{ fontFamily: FONT.pixel, fontSize: 24, color: '#cbb6e0' }}>⏳ Chargement des streams…</div>
          </div>
        ) : streams.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[22px]">
              {streams.map((s) => (
                <div key={s.id} style={{ background: '#1a0f26', border: `4px solid ${C.amethyst}`, borderRadius: 8, overflow: 'hidden', boxShadow: '0 8px 0 rgba(0,0,0,.4)' }}>
                  <div style={{ position: 'relative', aspectRatio: '16 / 9', background: '#000' }}>
                    <iframe src={twitchEmbed(s.login)} title={s.name} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
                    <div style={{ position: 'absolute', top: 12, left: 12, fontFamily: FONT.arcade, fontSize: 9, color: '#fff', background: C.red, padding: '7px 9px', borderRadius: 3, animation: 'v-pulseLive 1.6s infinite' }}>● EN DIRECT</div>
                    <div style={{ position: 'absolute', top: 12, right: 12, fontFamily: FONT.pixel, fontSize: 14, color: '#fff', background: 'rgba(0,0,0,.6)', padding: '5px 10px', borderRadius: 3 }}>👁 {s.viewers}</div>
                  </div>
                  <div style={{ padding: 16 }}>
                    <h3 style={{ fontFamily: FONT.pixel, fontSize: 22, margin: '0 0 4px', color: '#fff' }}>{s.name}</h3>
                    <p style={{ fontSize: 14, color: '#cbb6e0', margin: 0 }}>{s.title}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 30 }}>
              <a href={multistreamUrl} target="_blank" rel="noopener noreferrer" className="v-btn" style={{ fontFamily: FONT.pixel, fontSize: 19, color: '#fff', textDecoration: 'none', padding: '13px 26px', background: `linear-gradient(#a55fd0, ${C.amethyst})`, border: `4px solid ${C.amethystBorder}`, borderRadius: 5, boxShadow: 'inset -4px -4px 0 rgba(0,0,0,.25), inset 4px 4px 0 rgba(255,255,255,.3), 0 6px 0 #43275f' }}>📺 Voir en Multistream</a>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px 24px', background: 'rgba(255,255,255,.05)', border: `3px dashed ${C.amethyst}`, borderRadius: 8 }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>🌙</div>
            <div style={{ fontFamily: FONT.pixel, fontSize: 26, color: '#fff', marginBottom: 6 }}>Aucun stream en direct pour le moment</div>
            <p style={{ color: '#cbb6e0', margin: 0 }}>Reviens plus tard pour retrouver tes VTubers préférés en pleine aventure !</p>
          </div>
        )}
      </div>
    </section>
  );
}
