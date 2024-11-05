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
            author: postsResponse.data?.creatdBy
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

    async updatePost(request: Request, response: Response): Promise<void> {

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            response.status(400).json({
                status: 400,
                message: 'Bad Request',
                data: errors.array(),
            });
        }

        

        try {


            const postId = request.params.id;
            const userId = request.userId as string;
            const userRole = request.userRole as string;

            const { title, description, categories } = request.body;
            const updateData: { title?: string; description?: string, categories?: string[] } = {};

            if (title) updateData.title = title;
            if (description) updateData.description = description;
            if (categories) updateData.categories = categories;

            if (Object.keys(updateData).length === 0) {
                response.status(400).json({
                    status: 400,
                    message: 'Please provide at least one field to update!',
                });
            }

            const postResponse = await this.postsService.updatePost(postId, userId, userRole, updateData);

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

    async deletePost(request: Request, response: Response): Promise<void> {
        try {
            const postId = request.params.id;
            const userId = request.userId as string; // L'ID de l'utilisateur connecté
            const userRole = request.userRole as string; // Le rôle de l'utilisateur connecté

            const postResponse = await this.postsService.deletePost(postId, userId, userRole);

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

    async getPostsByUserId(request: Request, response: Response): Promise<void> {
        try {
            const userId = request.params.userId;

            const postResponse = await this.postsService.getPostsByUserId(userId);

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

    async getPostsByCategory(request: Request, response: Response): Promise<void> {
        try {
            const category = request.query.category as string;

            if (!category) {
                response.status(400).json({
                    status: 400,
                    message: 'Bad Request: category parameter is required.',
                });
                return;
            }

            const postResponse = await this.postsService.getPostsByCategory(category);

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