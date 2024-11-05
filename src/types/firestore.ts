import { firestore } from 'firebase-admin';
import CollectionReference = firestore.CollectionReference;
import DocumentData = firestore.DocumentData;

import { User } from './entities/User';
import { Post } from './entities/Post';
import { Comment } from './entities/Comment';
import { Vote } from './entities/Vote';

export interface FirestoreCollections {
    comments: CollectionReference<Comment, DocumentData>;
    users: CollectionReference<User, DocumentData>;
    posts: CollectionReference<Post, DocumentData>;
    votes: CollectionReference<Vote, DocumentData>;
}