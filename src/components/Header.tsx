import { Swords, Users, Tv, Home } from 'lucide-react';

export function Header() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-500/30">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-white">Virtualia</h1>
              <p className="text-xs text-purple-300">Saison 2</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">Accueil</span>
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors"
            >
              <Swords className="w-4 h-4" />
              <span className="hidden md:inline">Le Serveur</span>
            </button>
            <button 
              onClick={() => scrollToSection('streams')}
              className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors"
            >
              <Tv className="w-4 h-4" />
              <span className="hidden md:inline">Streams</span>
            </button>
            <button 
              onClick={() => scrollToSection('participants')}
              className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span className="hidden md:inline">Participants</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
