import { Request, Response } from 'express';
import { CommentsService } from '../services';
import { validationResult } from 'express-validator';

export class CommentsController {
    private commentsService: CommentsService;

    constructor(commentsService: CommentsService) {
        this.commentsService = commentsService;
    }

    async createComment(request: Request, response: Response): Promise<void> {

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            response.status(400).json({
                status: 400,
                message: 'Bad Request',
                data: errors.array(),
            });
        }

        try {
            const postId = request.params.postId;
            const { content } = request.body;
            const userId = request.userId; // Assuming `userId` is set by the auth middleware

            const commentData = {
                content,
                postId,
                createdBy: userId,
            };

            const commentResponse = await this.commentsService.createComment(commentData);

            response.status(commentResponse.status).json({
                ...commentResponse,
            });
        } catch (error) {
            response.status(500).json({
                status: 500,
                message: 'Internal server error',
                data: error,
            });
        }
    }

    // Récupérer tous les commentaires d’un post
    async getCommentsByPost(request: Request, response: Response): Promise<void> {

        try {
            const postId  = request.params.postId;
            const comments = await this.commentsService.getCommentsByPost(postId);

            response.status(comments.status).json({
                ...comments,
            });
        } catch (error) {
            response.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error,
            });
        }
    }

    // Récupérer un commentaire par son ID
    async getCommentById(request: Request, response: Response): Promise<void> {
        try {
            const id = request.params.id;
            const comments = await this.commentsService.getCommentById(id);

            response.status(comments.status).json({
                ...comments,
            });
        } catch (error) {
            response.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error,
            });
        }
    }

    // Mettre à jour un commentaire (accessible à l'auteur ou à un admin)
    async updateComment(request: Request, response: Response): Promise<void> {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            response.status(400).json({
                status: 400,
                message: 'Bad Request',
                data: errors.array(),
            });
        }

        try {

            const userId = request.userId as string;
            const userRole = request.userRole as string;
            const commentId = request.params.id;
            const content = request.body.content;

            const updatedComment = await this.commentsService.updateComment(commentId, userId, userRole, content);

            response.status(updatedComment.status).json({
                ...updatedComment,
            });
        } catch (error) {
            response.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error,
            });
        }
    }

    // Supprimer un commentaire (accessible à l'auteur ou à un admin)
    async deleteComment(request: Request, response: Response): Promise<void> {
        

        try {

            const userId = request.userId as string;
            const userRole = request.userRole as string;
            const commentId = request.params.id;
            
            const deleted = await this.commentsService.deleteComment(commentId, userId, userRole);

            response.status(deleted.status).json({
                ...deleted,
            });
        } catch (error) {
            response.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error,
            });
        }
    }
}
