import { Request, Response } from 'express';
import { PostsService} from '../services';
import { validationResult } from 'express-validator';
 
export class PostsController {
    private postsService: PostsService;

    constructor(postsService: PostsService) {
        this.postsService = postsService;
    }

    async createPost(request: Request, response: Response): Promise<void> {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            response.status(400).json({
                status: 400,
                message: 'Bad request.',
                data: errors.array(),
            });
        } else {
            try {
                const { title, description, categories } = request.body;

                const postData = {
                    title, 
                    description, 
                    categories,
                    createdBy: request.userId };

                const postResponse = await this.postsService.createPost(postData);

                response.status(postResponse.status).send({
                    ...postResponse,
                });
            } catch (error) {
                response.status(500).json({
                    status: 500,
                    message: 'Internal server error',
                    data: error
                });
            }
        }
    }

    async getPosts(request: Request, response: Response): Promise<void> {
        try {
        const postsResponse = await this.postsService.getPosts();

        response.status(postsResponse.status).send({
            ...postsResponse,
        });
        } catch (error) {
        response.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: error
        });
        }
    }

    async getPostById(request: Request, response: Response): Promise<void> {
        try {
            const postId = request.params.id;
            const postResponse = await this.postsService.getPostById(postId);

            response.status(postResponse.status).json({
                ...postResponse,
            });
        } catch (error) {
            response.status(500).json({
                status: 500,
                message: 'Internal server error',
                data: error,
            });
        }
    }

    async getCategories(request: Request, response: Response): Promise<void> {
        try {
        const categoriesResponse = await this.postsService.getCategories();

        response.status(categoriesResponse.status).send({
            ...categoriesResponse,
        });
        } catch (error) {
        response.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: error
        });
        }
    }
}