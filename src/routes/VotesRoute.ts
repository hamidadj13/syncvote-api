import { Router, Request, Response } from 'express';
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

        // Route pour ajouter un vote à un post
        router.post('/posts/:postId/vote', authJwt.verifyToken, validateVote, this.voteController.addVoteToPost.bind(this.voteController));

        // Route pour ajouter un vote à un commentaire
        router.post('/comments/:commentId/vote', authJwt.verifyToken, validateVote, this.voteController.addVoteToComment.bind(this.voteController));

        return router;
    }
}
