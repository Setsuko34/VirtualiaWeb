import { Server, Zap, Globe, Heart } from 'lucide-react';
import { Paper } from '@mui/material';

export function AboutSection() {
  const features = [
    {
      icon: Server,
      title: "Prominence 2",
      description: "Un modpack RPG avancé avec magie, exploration et technologie"
    },
    {
      icon: Heart,
      title: "100% VTubers",
      description: "Une communauté exclusive de créateurs de contenu VTuber"
    },
    {
      icon: Zap,
      title: "Contenu Unique",
      description: "Des événements, quêtes et aventures créées spécialement pour la saison 2"
    },
    {
      icon: Globe,
      title: "Monde Partagé",
      description: "Explorez, construisez et collaborez dans un univers persistant"
    }
  ];

  return (
    <section id="about" className="py-20 px-4 bg-gradient-to-b from-black via-purple-950/20 to-black">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-4 text-white">Bienvenue sur Virtualia</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Virtualia est un serveur Minecraft privé réunissant les meilleurs VTubers dans une aventure épique 
            sur le modpack Prominence 2. Plongez dans un monde de magie, de technologie et d'aventures infinies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Paper 
              key={index}
              elevation={0}
              className="bg-purple-950/30 border border-purple-500/30 p-6 hover:border-purple-400/50 transition-all hover:scale-105 rounded-lg"
              sx={{ backgroundColor: 'transparent' }}
            >
              <feature.icon className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </Paper>
          ))}
        </div>

        <Paper
            elevation={0}
            className="bg-purple-950/30 border border-purple-500/30 p-6 hover:border-purple-400/50 transition-all hover:scale-105 rounded-lg"
            sx={{ backgroundColor: 'transparent' }}
           >
          <h3 className="text-3xl mb-4 text-white">Le Concept de la Saison 2</h3>
          <div className="space-y-4 text-gray-300">
            <p>
              Après le succès retentissant de la première saison, Virtualia revient plus fort que jamais avec 
              la Saison 2 ! Cette nouvelle aventure propose un monde complètement renouvelé avec de nouveaux 
              défis, de nouvelles mécaniques et encore plus de possibilités de collaboration.
            </p>
            <p>
              Le modpack Prominence 2 apporte une dimension RPG enrichie avec des systèmes de magie avancés, 
              des donjons générés procéduralement, et des boss épiques à affronter en équipe. Chaque VTuber 
              pourra développer son propre style de jeu et contribuer à l'histoire collective du serveur.
            </p>
            <p>
              Rejoignez-nous pour suivre les aventures de vos VTubers préférés, regardez leurs streams en direct, 
              et découvrez comment ils façonnent ensemble ce monde virtuel unique !
            </p>
          </div>
        </Paper>
      </div>
    </section>
  );
}
