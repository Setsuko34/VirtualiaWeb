import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { C, FONT } from '../theme';
import { participants, twitchLogin } from '../data/participants';
import { LiveStream, twitchEmbed } from '../hooks/useStreams';
import React from "react";

interface Props {
  streams: LiveStream[];
  loading: boolean;
  videoSrc?: string;
}

// ordre de priorité pour le "stream à la une" = ordre du tableau participants
const PRIORITY = participants.map(twitchLogin).filter(Boolean) as string[];

function pickFeatured(streams: LiveStream[]): LiveStream | null {
  let best: LiveStream | null = null;
  let bestRank = Infinity;
  for (const s of streams) {
    const i = PRIORITY.indexOf(s.login);
    const rank = i < 0 ? 1e6 : i;
    if (rank < bestRank) { bestRank = rank; best = s; }
  }
  return best;
}

function EmberCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    let w = 0, h = 0, raf = 0;
    const resize = () => { w = cv.width = cv.offsetWidth; h = cv.height = cv.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const cols = ['#e0772c', '#f6d96b', '#ffae42', '#fff2b8'];
    const P = Array.from({ length: 46 }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: 1 + Math.random() * 3,
      s: 0.3 + Math.random() * 1.1, drift: (Math.random() - 0.5) * 0.5,
      c: cols[(Math.random() * cols.length) | 0], a: 0.4 + Math.random() * 0.6,
    }));
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of P) {
        p.y -= p.s; p.x += p.drift;
        if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
        ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
        ctx.fillRect(p.x | 0, p.y | 0, p.r * 2, p.r * 2);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }} />;
}

const cloud = (top: number, w: number, h: number, op: number, dur: number, delay: number, shadow: string): CSSProperties => ({
  position: 'absolute', top, left: 0, width: w, height: h, background: '#fff', borderRadius: 6, opacity: op,
  boxShadow: shadow, animation: `v-drift ${dur}s linear infinite`, animationDelay: `${delay}s`,
});


const floatBlock = (s: CSSProperties): CSSProperties => ({ position: 'absolute', imageRendering: 'pixelated', ...s });

export function HeroSection({ streams, loading, videoSrc = '/spawn.mp4' }: Props) {
  const featured = pickFeatured(streams);
  const [videoOk, setVideoOk] = useState(true);

  return (
    <header id="hero" className="px-5 pt-10 pb-[120px] md:pb-[200px]" style={{
      position: 'relative', minHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      background: 'linear-gradient(#a9d4f0 0%, #c7e6f4 38%, #e7ecd4 70%, #dfe8c4 100%)',
    }}>
      {/* TODO: déposer /spawn.mp4 pour activer le fond vidéo */}
      {videoOk && (
        <video src={videoSrc} autoPlay loop muted playsInline onError={() => setVideoOk(false)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(167,212,240,.18), rgba(220,228,190,.30))' }} />

      {/* soleil */}
      <div className="hidden sm:block" style={{ position: 'absolute', top: 60, right: '9%', width: 88, height: 88, background: '#f6d96b', border: `5px solid ${C.gold}`, boxShadow: 'inset -5px -5px 0 rgba(224,164,53,.5), 0 0 60px rgba(246,217,107,.7)', animation: 'v-spinSlow 50s linear infinite' }} />
      {/* nuages */}
      <div className="hidden sm:block" style={cloud(90, 160, 48, 0.92, 60, 0, '0 18px 0 -6px #fff,40px 18px 0 -6px #fff,-40px 18px 0 -6px #fff')} />
      <div className="hidden sm:block" style={cloud(180, 120, 38, 0.8, 90, -30, '30px 16px 0 -6px #fff,-30px 16px 0 -6px #fff')} />
      <div className="hidden sm:block" style={cloud(130, 200, 54, 0.7, 120, -70, '50px 22px 0 -8px #fff,-50px 22px 0 -8px #fff')} />

      {/* blocs flottants */}
      <div className="hidden sm:block" style={floatBlock({ top: '24%', left: '11%', width: 64, height: 64, background: C.grass, border: `4px solid ${C.woodDark}`, boxShadow: 'inset 0 14px 0 #8ec45a, inset 0 -10px 0 rgba(0,0,0,.2)', animation: 'v-bob 7s ease-in-out infinite' })} />
      <div className="hidden sm:block" style={floatBlock({ top: '42%', right: '13%', width: 58, height: 58, background: '#5fd3d6', border: '4px solid #1f5c63', boxShadow: 'inset -6px -6px 0 rgba(0,0,0,.2), inset 6px 6px 0 rgba(255,255,255,.4)', animation: 'v-bob2 9s ease-in-out infinite' })} />
      <div className="hidden sm:block" style={floatBlock({ top: '60%', left: '16%', width: 48, height: 48, background: '#caa15a', border: '4px solid #5e3f1c', boxShadow: 'inset -5px -5px 0 rgba(0,0,0,.22), inset 5px 5px 0 rgba(255,255,255,.3)', animation: 'v-bob 8s ease-in-out infinite', animationDelay: '-2s' })} />

      <EmberCanvas />

      {/* contenu : texte (gauche) + fenêtre stream (droite) */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1220, display: 'flex', gap: 36, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 380px', maxWidth: 560, textAlign: 'left', minWidth: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: FONT.arcade, fontSize: 11, color: '#fff', background: C.amethyst, border: `3px solid ${C.amethystBorder}`, borderRadius: 4, padding: '8px 14px', boxShadow: 'inset -3px -3px 0 rgba(0,0,0,.25), inset 3px 3px 0 rgba(255,255,255,.25), 0 4px 0 #43275f', marginBottom: 22 }}>SAISON 3 · MODPACK DRAGONFYRE</div>
          <h1 style={{ fontFamily: FONT.pixel, fontWeight: 700, fontSize: 'clamp(46px,7.5vw,104px)', lineHeight: 0.92, margin: '0 0 6px', color: C.cream, textShadow: `5px 5px 0 ${C.grass}, 10px 10px 0 ${C.ink}`, letterSpacing: 2 }}>VIRTUALIA</h1>
          <p style={{ fontFamily: FONT.pixel, fontSize: 'clamp(20px,3vw,30px)', color: C.cream, margin: '6px 0 8px', textShadow: '2px 2px 0 rgba(0,0,0,.7)' }}>Le serveur Minecraft des VTubers FR</p>
          <p style={{ fontSize: 'clamp(15px,1.8vw,19px)', color: C.cream, maxWidth: 620, margin: '0 0 30px', lineHeight: 1.55, textShadow: '1px 1px 0 rgba(0,0,0,.65)' }}>Une aventure RPG médiévale épique sur le modpack <strong>Cisco's Medieval RPG · Dragonfyre</strong> enrichi de dizaines de mods custom. Magie, donjons, dragons et chaos communautaire.</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 30 }}>
            <a href="#about" className="v-btn" style={{ fontFamily: FONT.pixel, fontSize: 21, color: '#fff', textDecoration: 'none', padding: '14px 30px', background: `linear-gradient(${C.grass}, ${C.grassDark})`, border: `4px solid ${C.grassBorder}`, borderRadius: 5, boxShadow: 'inset -4px -4px 0 rgba(0,0,0,.25), inset 4px 4px 0 rgba(255,255,255,.35), 0 6px 0 #2e4a18' }}>⚔ Rejoindre l'aventure</a>
            <a href="#streams" className="v-btn" style={{ fontFamily: FONT.pixel, fontSize: 21, color: '#fff', textDecoration: 'none', padding: '14px 30px', background: `linear-gradient(#a55fd0, ${C.amethyst})`, border: `4px solid ${C.amethystBorder}`, borderRadius: 5, boxShadow: 'inset -4px -4px 0 rgba(0,0,0,.25), inset 4px 4px 0 rgba(255,255,255,.3), 0 6px 0 #43275f' }}>▶ Voir les streams</a>
          </div>
        </div>

        {/* fenêtre : stream à la une */}
        <div style={{ flex: '1 1 380px', maxWidth: 560, width: '100%', minWidth: 0, position: 'relative', background: `linear-gradient(${C.woodBar1}, ${C.woodBar2})`, border: `6px solid ${C.woodDark}`, borderRadius: 9, padding: 14, boxShadow: 'inset -5px -5px 0 rgba(0,0,0,.3), inset 5px 5px 0 rgba(255,255,255,.18), 0 10px 0 rgba(58,42,24,.45)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
            <span style={{ width: 14, height: 14, background: C.red, border: '2px solid #2e1a0e' }} />
            <span style={{ width: 14, height: 14, background: C.gold, border: '2px solid #2e1a0e' }} />
            <span style={{ width: 14, height: 14, background: C.grass, border: '2px solid #2e1a0e' }} />
            <span style={{ fontFamily: FONT.pixel, fontSize: 17, color: C.cream, marginLeft: 6, textShadow: '2px 2px 0 #2e1a0e', whiteSpace: 'nowrap' }}>🔴 Stream à la une</span>
          </div>

          {loading ? (
            <div style={{ aspectRatio: '16 / 9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #2e1a0e', borderRadius: 4, background: '#1a140c', fontFamily: FONT.pixel, fontSize: 17, color: '#cbb6a0' }}>⏳ Recherche d'un live…</div>
          ) : featured ? (
            <>
              <div style={{ position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden', border: '4px solid #2e1a0e', borderRadius: 4, background: '#000' }}>
                <iframe src={twitchEmbed(featured.login)} title={featured.name} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
                <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 3, fontFamily: FONT.arcade, fontSize: 8, color: '#fff', background: C.red, padding: '5px 7px', borderRadius: 3, animation: 'v-pulseLive 1.6s infinite' }}>● EN DIRECT</div>
                <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 3, fontFamily: FONT.pixel, fontSize: 13, color: '#fff', background: 'rgba(0,0,0,.6)', padding: '4px 9px', borderRadius: 3 }}>👁 {featured.viewers}</div>
              </div>
              <div style={{ margin: '10px 4px 2px' }}>
                <div style={{ fontFamily: FONT.pixel, fontSize: 20, color: C.cream, textShadow: '2px 2px 0 #2e1a0e' }}>{featured.name}</div>
                <div style={{ fontSize: 13, color: '#cbb6a0', lineHeight: 1.4 }}>{featured.title}</div>
              </div>
            </>
          ) : (
            <>
              <div style={{ position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden', border: '4px solid #2e1a0e', borderRadius: 4, background: 'repeating-linear-gradient(45deg,#241b10 0 14px,#2c2114 14px 28px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: 40 }}>🌙</div>
                <div style={{ fontFamily: FONT.pixel, fontSize: 19, color: '#e7dabb', marginTop: 4 }}>Personne en live</div>
                <div style={{ fontSize: 13, color: '#9c8a66', marginTop: 4 }}>Reviens vite voir les aventuriers !</div>
              </div>
              <a href="#streams" style={{ display: 'block', textAlign: 'center', fontFamily: FONT.pixel, fontSize: 15, color: C.cream, textDecoration: 'none', margin: '10px 4px 2px' }}>Voir tous les streams →</a>
            </>
          )}
        </div>
      </div>

      {/* sol : herbe + terre */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 140, zIndex: 8, background: 'repeating-linear-gradient(90deg,#76ad44 0 64px,#67953a 64px 128px)', borderTop: '10px solid #8ec45a' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 90, zIndex: 8, background: 'repeating-linear-gradient(90deg,#7a5733 0 64px,#6b4a2b 64px 128px)', boxShadow: 'inset 0 8px 0 rgba(0,0,0,.18)' }} />
      {/* torches */}
      <div className="hidden sm:block" style={{ position: 'absolute', bottom: 96, left: '7%', zIndex: 9, width: 14, height: 54, background: C.wood, border: `3px solid ${C.woodDark}` }} />
      <div className="hidden sm:block" style={{ position: 'absolute', bottom: 140, left: 'calc(7% - 6px)', zIndex: 9, width: 24, height: 24, background: 'radial-gradient(circle,#ffe066,#e0772c)', borderRadius: '50%', boxShadow: '0 0 24px rgba(224,119,44,.9)', animation: 'v-flick .4s ease-in-out infinite' }} />
      <div className="hidden sm:block" style={{ position: 'absolute', bottom: 96, right: '7%', zIndex: 9, width: 14, height: 54, background: C.wood, border: `3px solid ${C.woodDark}` }} />
      <div className="hidden sm:block" style={{ position: 'absolute', bottom: 140, right: 'calc(7% - 6px)', zIndex: 9, width: 24, height: 24, background: 'radial-gradient(circle,#ffe066,#e0772c)', borderRadius: '50%', boxShadow: '0 0 24px rgba(224,119,44,.9)', animation: 'v-flick .45s ease-in-out infinite', animationDelay: '-.2s' }} />
    </header>
  );
}
