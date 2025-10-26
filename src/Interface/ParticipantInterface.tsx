import { SocialMediaInterface} from "./SocialMediaInterface";

export interface ParticipantInterface {
    id: string;
    name: string;
    minecraftPseudo: string;
    role: string;
    socialMedia: SocialMediaInterface;
    status: 'online' | 'offline';
}