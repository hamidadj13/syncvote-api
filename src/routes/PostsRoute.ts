import { Router } from 'express';
import { PostsController } from '../controllers';
import { validateCreatePost } from '../middlewares/dataValidator';
import   authJwt from "../middlewares/authJwt";

export class PostsRoute {
    private postsController: PostsController;

    constructor(postsController: PostsController) {
        this.postsController = postsController;
    }

    createRouter(): Router {
        const router = Router();

        router.post('/posts', authJwt.verifyToken, validateCreatePost, this.postsController.createPost.bind(this.postsController));

        router.get('/posts', this.postsController.getPosts.bind(this.postsController));

        // Route accessible à tous pour obtenir un post par ID
        router.get('/posts/:id', this.postsController.getPostById.bind(this.postsController));

        // Route pour mettre à jour un post - uniquement admin ou créateur
        router.put('/posts/:id', authJwt.verifyToken, this.postsController.updatePost.bind(this.postsController));

        // Route pour supprimer un post - uniquement admin ou créateur
        router.delete('/posts/:id', authJwt.verifyToken, this.postsController.deletePost.bind(this.postsController));

        // Route pour récupérer tous les posts d'un utilisateur - accessible à tous
        router.get('/users/:userId/posts', this.postsController.getPostsByUserId.bind(this.postsController));

        // Route pour récupérer tous les posts d'une catégorie - accessible à tous
        router.get('/filter-posts', this.postsController.getPostsByCategory.bind(this.postsController));





        router.get('/categories', this.postsController.getCategories.bind(this.postsController));


        return router;
    }
}