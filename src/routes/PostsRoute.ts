import { Router } from 'express';
import { PostsController } from '../controllers';
import { validateCreatePost, validateUpdatePost } from '../middlewares/dataValidator';
import authJwt from "../middlewares/authJwt";

export class PostsRoute {
    private postsController: PostsController;

    constructor(postsController: PostsController) {
        this.postsController = postsController;
    }

    createRouter(): Router {
        const router = Router();

        /**
         * @swagger
         * /posts:
         *   post:
         *     summary: Create a new post
         *     tags: [Posts]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               title:
         *                 type: string
         *               description:
         *                 type: string
         *               categories:
         *                 type: array
         *                 items:
         *                   type: string
         *     responses:
         *       201:
         *         description: Post created successfully
         *       400:
         *         description: Validation errors
         */
        router.post('/posts', authJwt.verifyToken, validateCreatePost, this.postsController.createPost.bind(this.postsController));

        /**
         * @swagger
         * /posts:
         *   get:
         *     summary: Get all posts
         *     tags: [Posts]
         *     responses:
         *       200:
         *         description: List of all posts
         *       500:
         *         description: Internal server error
         */
        router.get('/posts', this.postsController.getPosts.bind(this.postsController));

        /**
         * @swagger
         * /posts/{id}:
         *   get:
         *     summary: Get a post by ID
         *     tags: [Posts]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID of the post to retrieve
         *     responses:
         *       200:
         *         description: Post details
         *       404:
         *         description: Post not found
         */
        router.get('/posts/:id', this.postsController.getPostById.bind(this.postsController));

        /**
         * @swagger
         * /posts/{id}:
         *   put:
         *     summary: Update a post
         *     tags: [Posts]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID of the post to update
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               title:
         *                 type: string
         *               description:
         *                 type: string
         *               categories:
         *                 type: array
         *                 items:
         *                   type: string
         *     responses:
         *       200:
         *         description: Post updated successfully
         *       404:
         *         description: Post not found
         *       403:
         *         description: Unauthorized access
         */
        router.put('/posts/:id', authJwt.verifyToken, validateUpdatePost, this.postsController.updatePost.bind(this.postsController));

        /**
         * @swagger
         * /posts/{id}:
         *   delete:
         *     summary: Delete a post
         *     tags: [Posts]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID of the post to delete
         *     responses:
         *       200:
         *         description: Post deleted successfully
         *       404:
         *         description: Post not found
         *       403:
         *         description: Unauthorized access
         */
        router.delete('/posts/:id', authJwt.verifyToken, this.postsController.deletePost.bind(this.postsController));

        /**
         * @swagger
         * /users/{userId}/posts:
         *   get:
         *     summary: Get all posts by a specific user
         *     tags: [Posts]
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *         schema:
         *           type: string
         *         description: ID of the user whose posts to retrieve
         *     responses:
         *       200:
         *         description: List of posts by the user
         *       404:
         *         description: User not found
         */
        router.get('/users/:userId/posts', this.postsController.getPostsByUserId.bind(this.postsController));

        /**
         * @swagger
         * /filter-posts:
         *   get:
         *     summary: Get posts filtered by category
         *     tags: [Posts]
         *     parameters:
         *       - in: query
         *         name: category
         *         required: true
         *         schema:
         *           type: string
         *         description: Category to filter posts by
         *     responses:
         *       200:
         *         description: List of posts in the specified category
         *       400:
         *         description: Missing category parameter
         */
        router.get('/filter-posts', this.postsController.getPostsByCategory.bind(this.postsController));

        /**
         * @swagger
         * /categories:
         *   get:
         *     summary: Get all categories
         *     tags: [Posts]
         *     responses:
         *       200:
         *         description: List of categories
         *       500:
         *         description: Internal server error
         */
        router.get('/categories', this.postsController.getCategories.bind(this.postsController));

        return router;
    }
}
