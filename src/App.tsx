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
import { useStreams } from './hooks/useStreams';
import './styles/virtualia.css';
import React from "react";

// TODO: remplacer par l'IP définitive si elle change
const SERVER_IP = 'play.vtvirtualia.fr';

export default function App() {
  const { streams, loading, liveLogins } = useStreams();
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <Header ip={SERVER_IP} />
      <main>
        <HeroSection ip={SERVER_IP} streams={streams} loading={loading} videoSrc="/spawn.mp4" />
        <AboutSection />
        <WorldSection />
        <PlanningSection />
        <StreamsSection streams={streams} loading={loading} />
        <ParticipantsSection liveLogins={liveLogins} />
        <RulesSection />
      </main>
      <Footer onOpenMap={() => setMapOpen(true)} />
      <OldMapModal open={mapOpen} onClose={() => setMapOpen(false)} />
      <Analytics />
    </div>
  );
}
