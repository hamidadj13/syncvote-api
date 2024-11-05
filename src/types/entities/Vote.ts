import { Timestamp } from 'firebase/firestore';

export interface Vote {
    id?: string;
    targetId?: string; // ID de l'élément ciblé, peut être un post ou un commentaire
    targetType?: 'post' | 'comment' | string; // Type de cible : post ou commentaire
    userId?: string; // ID de l'utilisateur qui vote
    voteType?: 'like' | 'dislike' | string; // Type de vote
    createdAt?: Timestamp | Date; // Date de création du vote
}
