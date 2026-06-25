import rawData from './participants.json';

export type SocialType = 'twitch' | 'youtube' | 'tiktok' | 'twitter' | 'web';
export type Social = { type: SocialType; value: string };
export type Role = 'creatrice' | 'modo' | 'participant';

export interface Participant {
  name: string;
  pseudo: string;
  role: Role;
  socials: Social[];
}

export const participants = rawData as Participant[];

export const twitchLogin = (p: Participant): string | null => {
  const t = p.socials.find((s) => s.type === 'twitch');
  return t ? t.value.toLowerCase() : null;
};

export const ROLE_META: Record<Role, { label: string; accent: string }> = {
  creatrice: { label: '👑 Créatrice', accent: '#e0a435' },
  modo: { label: '🛡️ Modérateurs', accent: '#a55fd0' },
  participant: { label: '⚔️ Aventuriers', accent: '#76ad44' },
};
