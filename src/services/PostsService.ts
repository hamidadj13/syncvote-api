import { Post } from '../types/entities/Post';
import { FirestoreCollections } from '../types/firestore';
import { IResBody } from '../types/api';

import { firestoreTimestamp } from '../utils/firestore-helpers';
import { Timestamp } from 'firebase/firestore';

import { categories } from '../constants/categories';

import { formatPostData } from '../utils/formatData';

export class PostsService {
    private db: FirestoreCollections;

    constructor(db: FirestoreCollections) {
        this.db = db;
    }

    async createPost(postData: Post): Promise<IResBody> {
        const postRef = this.db.posts.doc();
        await postRef.set({
            ...postData,
            createdAt: firestoreTimestamp.now(),
            updatedAt: firestoreTimestamp.now(),
        });

        return {
            status: 201,
            message: 'Post created successfully!',
        };
    }

    async getPosts(): Promise<IResBody> {
        const posts: Post[] = [];
        const postsQuerySnapshot = await this.db.posts.get();

        for (const doc of postsQuerySnapshot.docs) {
            const formattedPost = formatPostData(doc.data())

            posts.push({
                id: doc.id,
                ...formattedPost,
                
            });
        }   

        return {
            status: 200,
            message: 'Posts retrieved successfully!',
            data: posts
        };
    }


    async getPostById(postId: string): Promise<IResBody> {
        try {
            const postSnapshot = await this.db.posts.doc(postId).get();

            if (!postSnapshot.exists) {
                return {
                    status: 404,
                    message: 'Post not found!',
                };
            }

            const post = postSnapshot.data() as Post;
            const postAuthor = post.createdBy as string;  // assuming each post has an author field for the author

            // Fetch the user associated with this post
            const userSnapshot = await this.db.users.doc(postAuthor).get();
            // if (!userSnapshot.exists) {
            //     return {
            //         status: 404,
            //         message: 'User not found!',
            //     };
            // }

            const user = userSnapshot.data();
            const username = user?.username || 'Unknown';  // Get the username or set a default

            const formattedPost = formatPostData(post);

            return {
                status: 200,
                message: 'Post retrieved successfully!',
                data: {
                    id: postSnapshot.id,
                    ...formattedPost,
                    createdBy: username
                },
            };
        } catch (error) {
            return {
                status: 500,
                message: 'Internal Server Error',
                data: error,
            };
        }
    }

    async updatePost(postId: string, userId: string, userRole: string, updatedData: Partial<Post>): Promise<IResBody> {
        try {
            const postSnapshot = await this.db.posts.doc(postId).get();

            if (!postSnapshot.exists) {
                return {
                    status: 404,
                    message: 'Post not found!',
                };
            }

            const post = postSnapshot.data() as Post;

            // Vérification : Seul l'admin ou le créateur du post peut le mettre à jour
            if (post.createdBy !== userId && userRole !== 'admin') {
                return {
                    status: 403,
                    message: 'Forbidden: You do not have permission to update this post.',
                };
            }

            // Mise à jour du post
            await this.db.posts.doc(postId).update({
                ...updatedData,
                updatedAt: firestoreTimestamp.now()// Mettre à jour le timestamp
            });

            return {
                status: 200,
                message: 'Post updated successfully!',
            };
        } catch (error) {
            return {
                status: 500,
                message: 'Internal Server Error',
                data: error,
            };
        }
    }

    async deletePost(postId: string, userId: string, userRole: string): Promise<IResBody> {
        try {
            const postSnapshot = await this.db.posts.doc(postId).get();

            if (!postSnapshot.exists) {
                return {
                    status: 404,
                    message: 'Post not found!',
                };
            }

            const post = postSnapshot.data() as Post;

            // Vérification : Seul l'admin ou le créateur du post peut le supprimer
            if (post.createdBy !== userId && userRole !== 'admin') {
                return {
                    status: 403,
                    message: 'Forbidden: You do not have permission to delete this post.',
                };
            }

            // Suppression du post
            await this.db.posts.doc(postId).delete();

            return {
                status: 200,
                message: 'Post deleted successfully!',
            };
        } catch (error) {
            return {
                status: 500,
                message: 'Internal Server Error',
                data: error,
            };
        }
    }

    // Nouvelle méthode pour récupérer les posts d'un utilisateur
    async getPostsByUserId(userId: string): Promise<IResBody> {
        try {
            const postsQuerySnapshot = await this.db.posts.where('createdBy', '==', userId).get();

            if (postsQuerySnapshot.empty) {
                return {
                    status: 404,
                    message: 'No posts found for this user.',
                };
            }

            const posts = postsQuerySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Post[];

            return {
                status: 200,
                message: 'Posts retrieved successfully!',
                data: posts,
            };
        } catch (error) {
            return {
                status: 500,
                message: 'Internal Server Error',
                data: error,
            };
        }
    }

    async getPostsByCategory(category: string): Promise<IResBody> {
        try {
            const postsQuerySnapshot = await this.db.posts.where('categories', 'array-contains', category).get();

            if (postsQuerySnapshot.empty) {
                return {
                    status: 404,
                    message: 'No posts found in this category.',
                };
            }

            const posts = postsQuerySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Post[];

            return {
                status: 200,
                message: 'Posts retrieved successfully!',
                data: posts,
            };
        } catch (error) {
            return {
                status: 500,
                message: 'Internal Server Error',
                data: error,
            };
        }
    }
    
    async getCategories(): Promise<IResBody> {

        return {
            status: 200,
            message: 'Categories retrieved successfully!',
            data: categories
        };
    }
}