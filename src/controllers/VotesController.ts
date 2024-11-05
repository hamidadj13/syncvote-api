import { Request, Response } from 'express';
import { VotesService } from '../services';
import { validationResult } from 'express-validator';

export class VotesController {
    private voteService: VotesService;

    constructor(voteService: VotesService) {
        this.voteService = voteService;
    }

    async addVoteToPost(request: Request, response: Response): Promise<void> {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(400).json({
                status: 400,
                message: 'Validation errors',
                data: errors.array(),
            });
            return;
        }

        try {
            const voteType = request.body.voteType
            const targetType  = 'post';
            const targetId = request.params.postId;
            const userId = request.userId as string;
            

            const vote = { targetId, targetType, voteType, userId }

            const voteResponse = await this.voteService.addVote(vote)

            response.status(voteResponse.status).send({
                ...voteResponse,
            });
        } catch (error) {
            response.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }
    }

    async addVoteToComment(request: Request, response: Response): Promise<void> {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(400).json({
                status: 400,
                message: 'Validation errors',
                data: errors.array(),
            });
            return;
        }

        try {
            const voteType = request.body.voteType
            const targetType  = 'comment';
            const targetId = request.params.commentId;
            const userId = request.userId as string;
            

            const vote = { targetId, targetType, voteType, userId }

            const voteResponse = await this.voteService.addVote(vote)

            response.status(voteResponse.status).send({
                ...voteResponse,
            });
        } catch (error) {
            response.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }
    }
}
