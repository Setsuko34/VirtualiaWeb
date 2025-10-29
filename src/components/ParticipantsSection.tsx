import { Users, Globe } from 'lucide-react';
import { AiOutlineYoutube, AiFillTwitch, AiFillTwitterCircle, AiOutlineTikTok   } from "react-icons/ai";
import { Paper, Chip } from '@mui/material';
// import { MinecraftSkin3D } from './MinecraftSkin3D';
import StarlightPoseSkin from './StarlightPoseSkin';
import {ParticipantInterface} from '../Interface/ParticipantInterface';
import participantsList from '../data/participants.json';
import React from "react";

export function ParticipantsSection() {
  // Mock data pour les participants
  // @ts-ignore
    const participants: ParticipantInterface[] = participantsList;

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitch':
        return <AiFillTwitch  className="w-4 h-4 text-white" />;
      case 'youtube':
        return <AiOutlineYoutube  className="w-4 h-4 text-white" />;
      case 'twitter':
        return <AiFillTwitterCircle className="w-4 h-4 text-white" />;
      case 'website':
        return <Globe className="w-4 h-4 text-white" />;
        case 'tiktok':
        return <AiOutlineTikTok  className="w-4 h-4 text-white" />;
      default:
        return null;
    }
  };

  return (
    <section id="participants" className="py-20 px-4 bg-gradient-to-b from-black via-purple-950/20 to-black">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-10 h-10 text-purple-400" />
            <h2 className="text-5xl text-white">Les Participants</h2>
          </div>
          <p className="text-xl text-gray-400">
            Découvrez tous les VTubers qui participent à Virtualia Saison 2
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {participants.map((participant, idx) => (
            <Paper
              key={participant.id}
              elevation={0}
              className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 p-6 hover:border-purple-400/50 transition-all hover:scale-105 rounded-lg"
              sx={{ backgroundColor: 'transparent' }}>
              {/* Skin via Starlight + Status */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative">
                  <StarlightPoseSkin
                    username={participant.minecraftPseudo}
                    width={200}
                    height={250}
                    className="mx-auto"
                    initialPoseIndex={idx}
                    // Active l'usage auto des skins publics hébergés en prod HTTPS
                    preferLocalSkin={true}
                    localPathPattern="/skin/{username}.png"
                  />
                  {/* Status Indicator */}
                  <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-gray-900 ${
                    participant.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                  } shadow-lg`}></div>
                </div>
                
                <h3 className="text-xl mt-3 text-white text-center">{participant.name}</h3>
                <Chip 
                  label={participant.role}
                  className="mt-2 bg-purple-600/50 text-purple-200 hover:bg-purple-600/70"
                  sx={{
                    backgroundColor: 'rgba(147, 51, 234, 0.5)',
                    color: 'rgb(233 213 255)',
                    '&:hover': { backgroundColor: 'rgba(147, 51, 234, 0.7)' }
                  }}
                />
              </div>

              {/* Social Media Links */}
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {participant.socialMedia.twitch && (
                  <a 
                    href={`https://twitch.tv/${participant.socialMedia.twitch}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-purple-700/30 hover:bg-purple-600/50 rounded-lg transition-colors"
                    title="Twitch"
                  >
                    {getSocialIcon('twitch')}
                  </a>
                )}
                {participant.socialMedia.youtube && (
                  <a 
                    href={`https://youtube.com/${participant.socialMedia.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-red-700/30 hover:bg-red-600/50 rounded-lg transition-colors"
                    title="YouTube"
                  >
                    {getSocialIcon('youtube')}
                  </a>
                )}
                {participant.socialMedia.twitter && (
                  <a 
                    href={`https://twitter.com/${participant.socialMedia.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-700/30 hover:bg-blue-600/50 rounded-lg transition-colors"
                    title="Twitter"
                  >
                    {getSocialIcon('twitter')}
                  </a>
                )}
                {participant.socialMedia.tiktok && (
                    <a
                        href={`https://www.tiktok.com/@${participant.socialMedia.tiktok.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gradient-to-r from-[#69C9D0] to-[#EE1D52] hover:opacity-90 rounded-lg transition-colors"
                        title="TikTok"
                    >
                        {getSocialIcon('tiktok')}
                    </a>
                )}
                {participant.socialMedia.website && (
                  <a 
                    href={`https://${participant.socialMedia.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-700/30 hover:bg-gray-600/50 rounded-lg transition-colors"
                    title="Site Web"
                  >
                    {getSocialIcon('website')}
                  </a>
                )}
              </div>
            </Paper>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Paper 
            elevation={0}
            className="bg-purple-900/20 border border-purple-500/30 p-6 text-center rounded-lg"
            sx={{ backgroundColor: 'transparent' }}
          >
            <p className="text-4xl text-purple-400 mb-2">{participants.length}</p>
            <p className="text-gray-400">Participants Total</p>
          </Paper>
          <Paper 
            elevation={0}
            className="bg-green-900/20 border border-green-500/30 p-6 text-center rounded-lg"
            sx={{ backgroundColor: 'transparent' }}
          >
            <p className="text-4xl text-green-400 mb-2">
              {participants.filter(p => p.status === 'online').length}
            </p>
            <p className="text-gray-400">En ligne maintenant</p>
          </Paper>
          <Paper 
            elevation={0}
            className="bg-pink-900/20 border border-pink-500/30 p-6 text-center rounded-lg"
            sx={{ backgroundColor: 'transparent' }}
          >
            <p className="text-4xl text-pink-400 mb-2">∞</p>
            <p className="text-gray-400">Aventures à vivre</p>
          </Paper>
        </div>
      </div>
    </section>
  );
}
