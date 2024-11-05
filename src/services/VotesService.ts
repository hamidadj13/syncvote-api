import { Vote } from '../types/entities/Vote';
import { IResBody } from '../types/api';
import { FirestoreCollections } from '../types/firestore';
import { firestoreTimestamp } from '../utils/firestore-helpers';
import { Post } from '../types/entities/Post';
import { Comment } from '../types/entities/Comment';

export class VotesService {
    private db: FirestoreCollections;

    constructor(db: FirestoreCollections) {
        this.db = db;
    }

    async addVote(voteData: Vote): Promise<IResBody> {
        const existingVote = await this.db.votes
            .where('targetId', '==', voteData.targetId)
            .where('userId', '==', voteData.userId)
            .get();

        if (!existingVote.empty) {
            return {
                status: 409,
                message: 'User has already voted on this item',
            };
        }

        const voteRef = this.db.votes.doc();
        await voteRef.set({
            ...voteData,
            createdAt: firestoreTimestamp.now(),
        });

            // Mettre à jour le post associé

        if (voteData.targetType === 'post') {
            const postRef = this.db.posts.doc(voteData.targetId as string); 
            const postSnapshot = await postRef.get();

            if (postSnapshot.exists) {
                const postData = postSnapshot.data() as Post; 

                
                let totalLike = postData.totalLike || 0;
                let totalDislike = postData.totalDislike || 0;

                if (voteData.voteType === 'like') {
                    totalLike += 1;

                } else if (voteData.voteType === 'dislike') {
                    totalDislike += 1; 
                }

                await postRef.update({
                    totalLike: totalLike,
                    totalDislike: totalDislike,
                });
            }

        } else if (voteData.targetType === 'comment') {

            const commentRef = this.db.comments.doc(voteData.targetId as string); 
            const commentSnapshot = await commentRef.get();

            if (commentSnapshot.exists) {
                const commentData = commentSnapshot.data() as Comment;

                
                let totalLike = commentData.totalLike || 0;
                let totalDislike = commentData.totalDislike || 0;

                if (voteData.voteType === 'like') {
                    totalLike += 1; 
                } else if (voteData.voteType === 'dislike') {
                    totalDislike += 1; 
                }

                
                await commentRef.update({
                    totalLike: totalLike,
                    totalDislike: totalDislike,
                    updatedAt: firestoreTimestamp.now(), 
                });
            }
        }
            
        


        return {
            status: 201,
            message: 'Vote added successfully!',
        };
        
    }
}
