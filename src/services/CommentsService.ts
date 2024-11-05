import { FirestoreCollections } from '../types/firestore';

import { Comment } from '../types/entities/Comment';

import { firestoreTimestamp } from '../utils/firestore-helpers';

import { IResBody } from '../types/api';

export class CommentsService {
    private db: FirestoreCollections;

    constructor(db: FirestoreCollections) {
        this.db = db;
    }

    async createComment(commentData: Comment): Promise<IResBody> {
        const commentRef = this.db.comments.doc();

        const newComment: Comment = {
            ...commentData,
            createdAt: firestoreTimestamp.now(),
            updatedAt: firestoreTimestamp.now(),
            totalLike: 0,
            totalDislike: 0,
        };

        await commentRef.set(newComment);

        return {
            status: 201,
            message: 'Comment added successfully!',
            data: { id: commentRef.id, ...newComment },
        };
    }

    async getCommentsByPost(postId: string): Promise<IResBody> {
        const commentsSnapshot = await this.db.comments.where('postId', '==', postId).get();

        const comments = commentsSnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        } ));

        return { 
            status: 200, 
            message: 'Comments retrieved successfully', 
            data: comments 
        };
   
    }

    async getCommentById(commentId: string): Promise<IResBody> {
        const commentDoc = await this.db.comments.doc(commentId).get();

            if (commentDoc.exists) {
                return {
                    status: 200,
                    message: 'Comment retrieved successfully',
                    data: { 
                        id: commentDoc.id, 
                        ...commentDoc.data() 
                    },
                };
            } else {
                return { 
                    status: 404, 
                    message: 'Comment not found' 
                };
            }
    }

    async updateComment(commentId: string, userId: string, userRole: string, updatedContent: string): Promise<IResBody> {
        const commentDoc = await this.db.comments.doc(commentId).get();

        if (commentDoc.exists) {
            
            const comment = commentDoc.data() as Comment;

            if (comment.createdBy !== userId && userRole !== 'admin') {
                return { 
                    status: 403, 
                    message: 'Forbidden: Not authorized to update this comment.' 
                };
            }

            await this.db.comments.doc(commentId).update({
                content: updatedContent,
                updatedAt: firestoreTimestamp.now(),
            });

            return { 
                status: 200, 
                message: 'Comment updated successfully', 
            };

        } else {
            return { 
                status: 404, 
                message: 'Comment not found' 
            };
        }
    }
    
    async deleteComment(commentId: string, userId: string, userRole: string): Promise<IResBody> {
        const commentDoc = await this.db.comments.doc(commentId).get();

        if (commentDoc.exists) {
            const comment = commentDoc.data() as Comment;

            if (comment.createdBy === userId || userRole === 'admin') {
                await this.db.comments.doc(commentId).delete();

                return { 
                    status: 200,
                    message: 'Comment deleted successfully'
                };
            } else {
                return { 
                    status: 403,
                    message: 'Forbidden: Not authorized to delete this comment.'
                };
            }
        } else {
            return {
                status: 404,
                message: 'Comment not found'
            };
        }
        
        
    }
}


