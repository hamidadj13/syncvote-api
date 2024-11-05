import { Router } from 'express';
import { UserController } from '../controllers';
import { validateCreateUser, validateLoginUser, validateChangePassword, validateUpdateUser } from '../middlewares/dataValidator';
import authJwt from '../middlewares/authJwt';

export class UsersRoute {
    private userController: UserController;

    constructor(userController: UserController) {
        this.userController = userController
    }

    createRouter(): Router {
        const router = Router();

        // Route to create an user
        router.post('/users', validateCreateUser, this.userController.createUser.bind(this.userController));

        // Route to get all users
        router.get('/users', authJwt.verifyToken, this.userController.getUsers.bind(this.userController));

        // Route to get an user by his ID
        router.get('/users/:id', authJwt.verifyToken, this.userController.getUserById.bind(this.userController));

        // Route to log into the application
        router.post('/auth/login', validateLoginUser, this.userController.login.bind(this.userController));

        // Route PUT pour mettre à jour un utilisateur, accessible uniquement aux admins
        router.put('/users/:id', authJwt.verifyToken, validateUpdateUser, this.userController.updateUserByAdmin.bind(this.userController));

        // Route PUT pour mettre à jour un utilisateur, accessible uniquement aux utilisateurs connectés
        router.put('/user/me', authJwt.verifyToken, validateUpdateUser, this.userController.updateUserByConnectUser.bind(this.userController));

        // Route DELETE pour supprimer un utilisateur (admin uniquement)
        router.delete('/users/:id', authJwt.verifyToken, this.userController.deleteUser.bind(this.userController));

        // Route PATCH pour changer le mot de passe de l'utilisateur connecté
        router.patch('/users/password', authJwt.verifyToken, validateChangePassword, this.userController.changePassword.bind(this.userController));


        return router;
    }
}