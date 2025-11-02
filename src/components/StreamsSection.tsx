// typescript
import React, {useEffect, useState} from 'react';
import {Tv, Circle} from 'lucide-react';
import {Paper, Chip, Button} from '@mui/material';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

interface Participant {
    id: string;
    name: string;
    socialMedia?: { twitch?: string };
    // autres champs si besoin
}

interface StreamApiItem {
    id: string;
    participant: Participant;
    stream: any | null; // helix stream object ou null
}

interface LocalStream {
    id: string;
    vtuberName: string;
    title: string;
    viewers: number;
    platform: 'Twitch' | 'YouTube';
    isLive: boolean;
    channel?: string; // login Twitch pour l'embed / lien
}

interface StreamsSectionProps {
    setCount?: (value: (((prevState: (number | undefined)) => (number | undefined)) | number | undefined)) => void
}

export function StreamsSection({setCount}: StreamsSectionProps) {
    const [liveStreams, setLiveStreams] = useState<LocalStream[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    async function fetchStreams() {
        try {
            const resp = await fetch('/api/twitch/streams');
            if (!resp.ok) throw new Error('fetch error');
            const json = await resp.json();
            const data: StreamApiItem[] = json?.data || [];

            const mapped: LocalStream[] = data
                .filter(item => item.stream) // garder uniquement les en direct
                .map(item => {
                    const s = item.stream;
                    const p = item.participant;
                    return {
                        id: item.id,
                        vtuberName: p.name || (p.socialMedia?.twitch ?? 'Unknown'),
                        title: s?.title || 'Live',
                        viewers: s?.viewer_count || 0,
                        platform: 'Twitch',
                        isLive: true,
                        channel: (p.socialMedia && p.socialMedia.twitch) ? String(p.socialMedia.twitch).toLowerCase() : undefined
                    };
                });

            // setCount(data.length);
            if (setCount) setCount(mapped.length);
            setLiveStreams(mapped);
        } catch (e) {
            console.error('Streams fetch error', e);
            setLiveStreams([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStreams();
        const id = setInterval(fetchStreams, 30000); // refresh toutes les 30s
        return () => clearInterval(id);
    }, []);

    const multistreamBase = 'https://www.multitwitch.tv';
    const multistreamUrl =
        liveStreams.length > 0
            ? `${multistreamBase}/${liveStreams.map(s => encodeURIComponent(s.vtuberName)).join('/')}`
            : multistreamBase;

    // helper pour construire l'URL d'embed Twitch (Twitch requiert le param parent)
    function twitchEmbedUrl(channel?: string) {
        if (!channel) return null;
        try {
            const parent = window.location.hostname;
            return `https://player.twitch.tv/?channel=${encodeURIComponent(channel)}&parent=${encodeURIComponent(parent)}&muted=true&autoplay=false`;
        } catch {
            return `https://www.twitch.tv/${encodeURIComponent(channel)}`;
        }
    }

    return (
        <section id="streams" className="py-20 px-4 bg-gradient-to-b from-black via-pink-950/20 to-black">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Tv className="w-10 h-10 text-pink-400"/>
                        <h2 className="text-5xl text-white">Streams en Direct</h2>
                    </div>
                    <p className="text-xl text-gray-400">
                        Regardez nos participants en action sur Virtualia et suivez leurs aventures !
                    </p>
                </div>

                {loading ? (
                    <Paper elevation={0} className="bg-gray-900/30 border border-gray-700 p-12 text-center rounded-lg">
                        <Tv className="w-16 h-16 text-gray-600 mx-auto mb-4"/>
                        <p className="text-xl text-gray-400">Chargement des streams...</p>
                    </Paper>
                ) : liveStreams.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {liveStreams.map((stream) => {
                            const embedUrl = twitchEmbedUrl(stream.channel);
                            return (
                                <Paper
                                    key={stream.id}
                                    elevation={0}
                                    className="bg-purple-950/30 border border-pink-500/30 overflow-hidden hover:border-pink-400/50 transition-all rounded-lg"
                                    sx={{backgroundColor: 'transparent'}}
                                >
                                    {/* Video / embed container */}
                                    <div
                                        className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                                        {/* Si on a un embed Twitch, on le place en absolute pour être au-dessus du dégradé */}
                                        {stream.isLive && embedUrl ? (
                                            // iframe peut être bloqué si parent mismatch ; on laisse fallback plus bas
                                            <iframe
                                                title={`player-${stream.id}`}
                                                src={embedUrl}
                                                allow="autoplay; fullscreen; picture-in-picture"
                                                allowFullScreen
                                                width="100%"
                                                height="100%"
                                                frameBorder={0}
                                                className="absolute inset-0 w-full h-full border-0"
                                                style={{zIndex: 10, display: 'block'}}
                                            />
                                        ) : null}

                                        {/* Live Badge */}
                                        {stream.isLive && (
                                            <div className="absolute top-4 left-4 z-30">
                                                <Chip
                                                    icon={<Circle className="w-2 h-2 fill-white animate-pulse"/>}
                                                    label="EN DIRECT"
                                                    className="bg-red-600 hover:bg-red-600 text-white"
                                                    sx={{
                                                        backgroundColor: 'rgb(220 38 38)',
                                                        color: 'white',
                                                        '&:hover': {backgroundColor: 'rgb(220 38 38)'},
                                                        '& .MuiChip-icon': {color: 'white'},
                                                        zIndex: 20
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Viewers */}
                                        <div className="absolute top-4 right-4 z-30">
                                            <Chip
                                                label={`${stream.viewers.toLocaleString()} viewers`}
                                                className="bg-black/60 text-white"
                                                sx={{
                                                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                    color: 'white',
                                                    zindex: 100,
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
                            );
                        })}
                    </div>
                ) : (
                    <Paper elevation={0}
                           className="border border-pink-400/50  p-12 text-center rounded-lg"
                           sx={{backgroundColor: 'transparent'}}>
                        <Tv className="w-16 h-16 text-purple-400 mx-auto mb-4"/>
                        <p className="text-xl text-gray-300">Aucun stream en direct pour le moment</p>
                        <p className="text-gray-300 mt-2">Revenez plus tard pour voir vos VTubers préférés !</p>
                    </Paper>
                )}

                {/* Multistream Note */}
                {liveStreams.length > 0 && (
                    <div className="mt-8 text-center">
                        <p className="text-gray-400">
                            💡 Astuce : Cliquez sur ce bouton pour voir plusieurs streams simultanément pour une
                            expérience multistream complète !
                        </p>
                        <Button
                            variant="outlined"
                            color="inherit"
                            disableElevation
                            onClick={() => window.open(multistreamUrl, '_blank', 'noopener,noreferrer')}
                            sx={{
                                mt: 2,
                                color: '#ffffff',
                                borderColor: '#db2777',
                                px: 2,
                                py: 1,
                                borderRadius: '2rem',
                                transitionProperty: 'background-color, color, border-color',
                                transitionDuration: '150ms',
                                '&:hover': {backgroundColor: '#ec4899'}
                            }}
                            aria-label="Ouvrir Multistream"
                        >
                            <DynamicFeedIcon/> &nbsp;
                            Voir en Multistream
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}