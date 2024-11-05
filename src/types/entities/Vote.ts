import { Timestamp } from 'firebase/firestore';

export interface Vote {
    postId: string;
    userId: string;
    type: 'like' | 'dislike';
    createdAt: Date;
}