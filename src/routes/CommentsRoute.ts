import { Router } from 'express';
import { CommentsController } from '../controllers';
import { validateCreateComment, validateUpdateComment } from '../middlewares/dataValidator';
import authJwt from '../middlewares/authJwt';

export class CommentsRoute {
    private commentController: CommentsController;

    constructor(commentController: CommentsController) {
        this.commentController = commentController;
    }

    createRouter(): Router {
        const router = Router();

        /**
         * @swagger
         * /posts/{postId}/comments:
         *   post:
         *     summary: Add a comment to a post
         *     tags: [Comments]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: postId
         *         required: true
         *         schema:
         *           type: string
         *         description: ID of the post to comment on
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               content:
         *                 type: string
         *                 description: Content of the comment
         *     responses:
         *       201:
         *         description: Comment added successfully
         *       400:
         *         description: Validation error
         */
        router.post('/posts/:postId/comments', authJwt.verifyToken, validateCreateComment, this.commentController.createComment.bind(this.commentController));

        /**
         * @swagger
         * /posts/{postId}/comments:
         *   get:
         *     summary: Get all comments for a post
         *     tags: [Comments]
         *     parameters:
         *       - in: path
         *         name: postId
         *         required: true
         *         schema:
         *           type: string
         *         description: ID of the post to retrieve comments for
         *     responses:
         *       200:
         *         description: List of comments for the post
         *       404:
         *         description: Post not found
         */
        router.get('/posts/:postId/comments', this.commentController.getCommentsByPost.bind(this.commentController));

        /**
         * @swagger
         * /comments/{id}:
         *   get:
         *     summary: Get a comment by ID
         *     tags: [Comments]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID of the comment to retrieve
         *     responses:
         *       200:
         *         description: Comment details
         *       404:
         *         description: Comment not found
         */
        router.get('/comments/:id', this.commentController.getCommentById.bind(this.commentController));

        /**
         * @swagger
         * /comments/{id}:
         *   put:
         *     summary: Update a comment
         *     tags: [Comments]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID of the comment to update
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               content:
         *                 type: string
         *                 description: Updated content of the comment
         *     responses:
         *       200:
         *         description: Comment updated successfully
         *       404:
         *         description: Comment not found
         *       403:
         *         description: Unauthorized access
         */
        router.put('/comments/:id', authJwt.verifyToken, validateUpdateComment, this.commentController.updateComment.bind(this.commentController));

        /**
         * @swagger
         * /comments/{id}:
         *   delete:
         *     summary: Delete a comment
         *     tags: [Comments]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID of the comment to delete
         *     responses:
         *       200:
         *         description: Comment deleted successfully
         *       404:
         *         description: Comment not found
         *       403:
         *         description: Unauthorized access
         */
        router.delete('/comments/:id', authJwt.verifyToken, this.commentController.deleteComment.bind(this.commentController));

        return router;
    }
}
