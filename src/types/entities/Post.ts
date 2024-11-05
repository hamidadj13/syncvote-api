import { Timestamp } from 'firebase/firestore';

export interface  Post {
    id?: string;
    title?: string;
    description?: string;
    totalLike?: number;
    totalDislike?: number;
    categories?: string[];
    createdBy?: string
    createdAt?: Timestamp | Date;
    updatedAt?: Timestamp | Date;
}