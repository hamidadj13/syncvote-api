import { Timestamp } from 'firebase-admin/firestore';


export interface Comment {
    id?: string;
    content?: string;
    totalLike?: number;
    totalDislike?: number;
    postId?: string;
    createdBy?: string
    createdAt?: Timestamp | Date;
    updatedAt?: Timestamp | Date;
}