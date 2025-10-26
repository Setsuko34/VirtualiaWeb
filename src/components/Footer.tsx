import { Heart, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black border-t border-purple-500/30 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h3 className="text-2xl text-white">Virtualia</h3>
            <Sparkles className="w-6 h-6 text-pink-400" />
          </div>
          
          <p className="text-gray-400 mb-4">
            Serveur Minecraft VTuber - Saison 2
          </p>
          
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            Fait par Setsuko_Aka avec le <Heart className="w-4 h-4 text-red-500 fill-red-500" /> pour Virtualia
          </p>
          
          <p className="text-gray-600 text-xs mt-4">
            © 2025 Virtualia. Serveur privé - Prominence 2 Modpack
          </p>
        </div>
      </div>
    </footer>
  );
}
