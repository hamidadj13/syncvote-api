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

        // Route pour ajouter un commentaire à un post, seulement pour les utilisateurs authentifiés
        router.post('/posts/:postId/comments', authJwt.verifyToken, validateCreateComment, this.commentController.createComment.bind(this.commentController));

        // Récupérer tous les commentaires d’un post
        router.get('/posts/:postId/comments', this.commentController.getCommentsByPost.bind(this.commentController));

        // Récupérer un commentaire via son id
        router.get('/comments/:id', this.commentController.getCommentById.bind(this.commentController));

        // Mettre à jour un commentaire (accessible à l'auteur ou à un admin)
        router.put('/comments/:id', authJwt.verifyToken, validateUpdateComment, this.commentController.updateComment.bind(this.commentController));

        // Supprimer un commentaire (accessible à l'auteur ou à un admin)
        router.delete('/comments/:id', authJwt.verifyToken, this.commentController.deleteComment.bind(this.commentController));

        return router;
    }
}
