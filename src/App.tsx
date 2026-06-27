import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { WorldSection } from './components/WorldSection';
import { PlanningSection } from './components/PlanningSection';
import { StreamsSection } from './components/StreamsSection';
import { ParticipantsSection } from './components/ParticipantsSection';
import { RulesSection } from './components/RulesSection';
import { Footer } from './components/Footer';
import { OldMapModal } from './components/OldMapModal';
import { CreditsModal } from './components/CreditsModal';
import { useStreams } from './hooks/useStreams';
import './styles/virtualia.css';
import React from "react";

const SERVER_IP = 'play.vtvirtualia.fr';

export default function App() {
  const { streams, loading, liveLogins } = useStreams();
  const [mapOpen, setMapOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded focus:outline-none"
        style={{ background: '#76ad44', color: '#fff', fontFamily: 'system-ui, sans-serif', fontSize: 15 }}
      >
        Aller au contenu principal
      </a>
      <Header ip={SERVER_IP} />
      <main id="main-content">
        <HeroSection streams={streams} loading={loading} videoSrc="/spawn.mp4" />
        <AboutSection />
        <WorldSection />
        <PlanningSection />
        <StreamsSection streams={streams} loading={loading} />
        <ParticipantsSection liveLogins={liveLogins} />
        <RulesSection />
      </main>
      <Footer onOpenMap={() => setMapOpen(true)} onOpenCredits={() => setCreditsOpen(true)} />
      <OldMapModal open={mapOpen} onClose={() => setMapOpen(false)} />
      <CreditsModal open={creditsOpen} onClose={() => setCreditsOpen(false)} />
      <Analytics />
    </div>
  );
}
