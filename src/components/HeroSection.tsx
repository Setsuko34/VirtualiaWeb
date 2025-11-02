import {FileBox, TvMinimalPlay, Users} from 'lucide-react';
import React from "react";

interface HeroSectionProps {
  backgroundImage: string;
}

export function HeroSection({ backgroundImage }: HeroSectionProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-purple-900/50 to-black/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
         <img src="/logoBig.png" alt="Virtualia" className="object-contain mx-auto " width={'45%'} />
        </div>
        <div className="inline-block px-6 py-2 bg-purple-600/30 border border-purple-400/50 rounded-full mb-8">
          <p className="text-2xl md:text-3xl text-purple-200">Saison 2</p>
        </div>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-4">
          Le serveur Minecraft VTuber ultime
        </p>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Découvrez un monde fantastique où vos VTubers préférés se rencontrent dans l'univers de Prominence 2
        </p>

    <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
        <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                onClick={() => document.getElementById('participants')?.scrollIntoView({ behavior: 'smooth' })}>
            <Users  className="w-5 h-5"/>
            Les participants
        </button>
        <button
            onClick={() => document.getElementById('streams')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-transparent border-2 border-purple-400 hover:bg-purple-400/10 text-purple-300 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
            <TvMinimalPlay className="w-5 h-5"/>
            Les streams
        </button>
    </div>
          <div className="mt-4 flex justify-center">
              <button
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  onClick={() => window.open('https://rpg.prominence.wiki/hasturian-era/b/66ACEBE7-937C-4075-A14C-0199049E38D6/Conjunctivius-(Recommended-Level-30', '_blank')}
              >
                  <FileBox className="w-5 h-5" />
                  Le modpack
              </button>
          </div>
</div>


      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-purple-400 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
