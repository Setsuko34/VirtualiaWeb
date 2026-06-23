// Liste des participants — Saison 3 (ordre = priorité d'affichage / "stream à la une")
// NB: certains pseudos Minecraft sont des suppositions (fallback skin Steve si introuvable).
//     Complète `pseudo` et `socials` avec les vraies valeurs.

export type SocialType = 'twitch' | 'youtube' | 'tiktok' | 'twitter' | 'web';
export type Social = { type: SocialType; value: string };
export type Role = 'creatrice' | 'modo' | 'participant';

export interface Participant {
  name: string;
  pseudo: string;        // pseudo Minecraft (pour le render de skin)
  role: Role;
  socials: Social[];
}

export const participants: Participant[] = [
  { name: 'VTYukiUwU', pseudo: 'VTYukiUwU', role: 'creatrice', socials: [
    { type: 'twitch', value: 'vtyukiuwu' },
    { type: 'youtube', value: '@Yuki____UwU899' },
    { type: 'tiktok', value: '@vtyukiuwu' },
    { type: 'twitter', value: 'VTYukiUwU' },
  ] },

  { name: 'Kamina', pseudo: 'Meadras', role: 'modo', socials: [
    { type: 'twitch', value: 'kamicie' },
    { type: 'tiktok', value: '@kami_cie' },
  ] },
  { name: 'Setsuko', pseudo: 'Setsuko_Aka', role: 'modo', socials: [
    { type: 'twitch', value: 'setsuko_aka' },
    { type: 'youtube', value: '@Setsuko_Aka' },
    { type: 'twitter', value: 'setsuko_aka' },
    { type: 'web', value: 'setsukoaka.fr' },
  ] },
  { name: 'Mizuhiro', pseudo: 'Mizuhir0_', role: 'modo', socials: [
    { type: 'twitch', value: 'VTMizuhiro' },
  ] },

  { name: 'Nifrendiel', pseudo: 'Nifrendiel', role: 'participant', socials: [{ type: 'twitch', value: 'nifrendiel' }] },
  { name: 'Saitilink', pseudo: 'Saitilink', role: 'participant', socials: [{ type: 'twitch', value: 'saitilink' }] },
  { name: '4bearden', pseudo: '4bearden', role: 'participant', socials: [{ type: 'twitch', value: '4bearden' }] },
  { name: 'Inkcrystal', pseudo: 'Inkcrystal', role: 'participant', socials: [{ type: 'twitch', value: 'inkcrystal' }] },
  { name: 'Numia', pseudo: 'Numia', role: 'participant', socials: [{ type: 'twitch', value: 'numia' }] },
  { name: 'Malidoudou', pseudo: 'Malidoudou', role: 'participant', socials: [{ type: 'twitch', value: 'malidoudou' }] },
  { name: 'Rifox', pseudo: 'Rifox', role: 'participant', socials: [{ type: 'twitch', value: 'rifox' }] },
  { name: 'Couaxia', pseudo: 'Couaxia', role: 'participant', socials: [{ type: 'twitch', value: 'couaxia' }] },
  { name: 'Sorine', pseudo: 'Sorine', role: 'participant', socials: [{ type: 'twitch', value: 'sorine' }] },
  { name: 'Dollscherire', pseudo: 'dollcheshire', role: 'participant', socials: [
    { type: 'twitch', value: 'dollcheshire' },
    { type: 'youtube', value: '@dollcheshire' },
    { type: 'tiktok', value: '@dollcheshire' },
    { type: 'twitter', value: 'ChesCatWonder' },
  ] },
  { name: 'Orion Yamato', pseudo: 'OrionYamato', role: 'participant', socials: [{ type: 'twitch', value: 'orionyamato' }] },
  { name: 'Nymya', pseudo: 'Nymya', role: 'participant', socials: [{ type: 'twitch', value: 'nymya' }] },
  { name: 'maman miki', pseudo: 'mamanmiki', role: 'participant', socials: [{ type: 'twitch', value: 'mamanmiki' }] },
  { name: 'Miss_CherryLee', pseudo: 'Miss_CherryLee', role: 'participant', socials: [{ type: 'twitch', value: 'miss_cherrylee' }] },
  { name: 'Avril_phantome', pseudo: 'Avril_phantome', role: 'participant', socials: [{ type: 'twitch', value: 'avril_phantome' }] },
  { name: 'Anariake', pseudo: 'Anariake', role: 'participant', socials: [{ type: 'twitch', value: 'anariake' }] },
  { name: 'Xanthe_vt', pseudo: 'Xanthe_vt', role: 'participant', socials: [{ type: 'twitch', value: 'xanthe_vt' }] },
];

export const twitchLogin = (p: Participant): string | null => {
  const t = p.socials.find((s) => s.type === 'twitch');
  return t ? t.value.toLowerCase() : null;
};

export const ROLE_META: Record<Role, { label: string; accent: string }> = {
  creatrice: { label: '👑 Créatrice', accent: '#e0a435' },
  modo: { label: '🛡️ Modérateurs', accent: '#a55fd0' },
  participant: { label: '⚔️ Aventuriers', accent: '#76ad44' },
};
