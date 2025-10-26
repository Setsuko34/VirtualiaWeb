import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { StreamsSection } from './components/StreamsSection';
import { ParticipantsSection } from './components/ParticipantsSection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <HeroSection 
          //backgroundImage="https://images.unsplash.com/photo-1665520937321-5388fb465942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5lY3JhZnQlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzYxNDA0Njg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          backgroundImage={'/herosection.jpg'}
        />
        <AboutSection />
        <StreamsSection />
        <ParticipantsSection />
      </main>
      <Footer />
    </div>
  );
}
