import { Router } from 'express';
import { VotesController } from '../controllers';
import authJwt from '../middlewares/authJwt';
import { validateVote } from '../middlewares/dataValidator';

export class VotesRoute {
    private voteController: VotesController;

    constructor(voteController: VotesController) {
        this.voteController = voteController;
    }

    createRouter(): Router {
        const router = Router();

        /**
         * @swagger
         * /posts/{postId}/vote:
         *   post:
         *     summary: Add a vote to a post
         *     tags: [Votes]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: postId
         *         required: true
         *         schema:
         *           type: string
         *         description: ID of the post to vote on
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               voteType:
         *                 type: string
         *                 description: The type of vote (e.g., 'like' or 'dislike')
         *     responses:
         *       201:
         *         description: Vote added successfully
         *       400:
         *         description: Validation error
         *       409:
         *         description: Conflict - User has already voted
         */
        router.post('/posts/:postId/vote', authJwt.verifyToken, validateVote, this.voteController.addVoteToPost.bind(this.voteController));

        /**
         * @swagger
         * /comments/{commentId}/vote:
         *   post:
         *     summary: Add a vote to a comment
         *     tags: [Votes]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: commentId
         *         required: true
         *         schema:
         *           type: string
         *         description: ID of the comment to vote on
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               voteType:
         *                 type: string
         *                 description: The type of vote (e.g., 'like' or 'dislike')
         *     responses:
         *       201:
         *         description: Vote added successfully
         *       400:
         *         description: Validation error
         *       409:
         *         description: Conflict - User has already voted
         */
        router.post('/comments/:commentId/vote', authJwt.verifyToken, validateVote, this.voteController.addVoteToComment.bind(this.voteController));

        return router;
    }
}
