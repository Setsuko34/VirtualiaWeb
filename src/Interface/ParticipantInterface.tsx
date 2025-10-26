import { SocialMediaInterface} from "./SocialMediaInterface";

export interface ParticipantInterface {
    id: string;
    name: string;
    skinUrl: string;
    role: string;
    socialMedia: SocialMediaInterface;
    status: 'online' | 'offline';
}