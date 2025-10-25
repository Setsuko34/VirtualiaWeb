import { Tv, Circle } from 'lucide-react';
import { Paper, Chip } from '@mui/material';

interface Stream {
  id: string;
  vtuberName: string;
  title: string;
  viewers: number;
  platform: 'Twitch' | 'YouTube';
  isLive: boolean;
}

export function StreamsSection() {
  // Mock data pour les streams actuellement en direct
  const liveStreams: Stream[] = [
    {
      id: '1',
      vtuberName: 'Luna_VT',
      title: 'Construction de ma base magique ! | Virtualia S2',
      viewers: 1234,
      platform: 'Twitch',
      isLive: true
    },
    {
      id: '2',
      vtuberName: 'Kaito_Gaming',
      title: 'Exploration du Nether - Boss Fight! | Virtualia',
      viewers: 856,
      platform: 'YouTube',
      isLive: true
    },
    {
      id: '3',
      vtuberName: 'Sakura_Chan',
      title: 'Farming & Chill ✨ Virtualia Saison 2',
      viewers: 2103,
      platform: 'Twitch',
      isLive: true
    },
    {
      id: '4',
      vtuberName: 'Ryu_Stream',
      title: 'Quête épique avec les amis | Virtualia S2',
      viewers: 678,
      platform: 'YouTube',
      isLive: true
    }
  ];

  return (
    <section id="streams" className="py-20 px-4 bg-gradient-to-b from-black via-pink-950/20 to-black">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Tv className="w-10 h-10 text-pink-400" />
            <h2 className="text-5xl text-white">Streams en Direct</h2>
          </div>
          <p className="text-xl text-gray-400">
            Regardez vos VTubers préférés en action sur Virtualia
          </p>
        </div>

{liveStreams.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {liveStreams.map((stream) => (
              <Paper 
                key={stream.id} 
                elevation={0}
                className="bg-gray-900/50 border border-pink-500/30 overflow-hidden hover:border-pink-400/50 transition-all rounded-lg"
              >
                {/* Video Placeholder */}
                <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                  <div className="text-center">
                    <Tv className="w-16 h-16 text-pink-400 mx-auto mb-2 opacity-50" />
                    <p className="text-gray-500 text-sm">Stream Player - {stream.platform}</p>
                  </div>
                  
                  {/* Live Badge */}
                  {stream.isLive && (
                    <div className="absolute top-4 left-4">
                      <Chip 
                        icon={<Circle className="w-2 h-2 fill-white animate-pulse" />}
                        label="EN DIRECT"
                        className="bg-red-600 hover:bg-red-600 text-white"
                        sx={{
                          backgroundColor: 'rgb(220 38 38)',
                          color: 'white',
                          '&:hover': { backgroundColor: 'rgb(220 38 38)' },
                          '& .MuiChip-icon': { color: 'white' }
                        }}
                      />
                    </div>
                  )}

                  {/* Viewers */}
                  <div className="absolute top-4 right-4">
                    <Chip 
                      label={`${stream.viewers.toLocaleString()} viewers`}
                      className="bg-black/60 text-white"
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white'
                      }}
                    />
                  </div>
                </div>

                {/* Stream Info */}
                <div className="p-4">
                  <h3 className="text-xl mb-2 text-white">{stream.vtuberName}</h3>
                  <p className="text-gray-400 mb-3">{stream.title}</p>
                  <div className="flex items-center gap-2">
                    <Chip 
                      label={stream.platform}
                      variant="outlined"
                      className="border-pink-400/50 text-pink-300"
                      sx={{
                        borderColor: 'rgba(244, 114, 182, 0.5)',
                        color: 'rgb(249 168 212)'
                      }}
                    />
                  </div>
                </div>
              </Paper>
            ))}
          </div>
        ) : (
          <Paper 
            elevation={0}
            className="bg-gray-900/30 border border-gray-700 p-12 text-center rounded-lg"
          >
            <Tv className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">Aucun stream en direct pour le moment</p>
            <p className="text-gray-500 mt-2">Revenez plus tard pour voir vos VTubers préférés !</p>
          </Paper>
        )}

        {/* Multistream Note */}
        {liveStreams.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              💡 Astuce : Ouvrez plusieurs streams simultanément pour une expérience multistream complète !
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
