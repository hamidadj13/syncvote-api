import { Router } from 'express';
import { UserController } from '../controllers';
import { validateCreateUser, validateLoginUser, validateChangePassword, validateUpdateUser } from '../middlewares/dataValidator';
import authJwt from '../middlewares/authJwt';

export class UsersRoute {
    private userController: UserController;

    constructor(userController: UserController) {
        this.userController = userController;
    }

    createRouter(): Router {
        const router = Router();

        /**
         * @swagger
         * /users:
         *   post:
         *     summary: Create a new user
         *     tags: [Users]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *               email:
         *                 type: string
         *               password:
         *                 type: string
         *     responses:
         *       201:
         *         description: User successfully created
         *       400:
         *         description: Validation error
         */
        router.post('/users', validateCreateUser, this.userController.createUser.bind(this.userController));

        /**
         * @swagger
         * /users:
         *   get:
         *     summary: Retrieve a list of all users
         *     tags: [Users]
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: List of users
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *                 properties:
         *                   id:
         *                     type: string
         *                   name:
         *                     type: string
         *                   email:
         *                     type: string
         */
        router.get('/users', authJwt.verifyToken, this.userController.getUsers.bind(this.userController));

        /**
         * @swagger
         * /users/{id}:
         *   get:
         *     summary: Retrieve a user by ID
         *     tags: [Users]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: User ID
         *     responses:
         *       200:
         *         description: User details
         *       404:
         *         description: User not found
         */
        router.get('/users/:id', authJwt.verifyToken, this.userController.getUserById.bind(this.userController));

        /**
         * @swagger
         * /auth/login:
         *   post:
         *     summary: User login
         *     tags: [Auth]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               email:
         *                 type: string
         *               password:
         *                 type: string
         *     responses:
         *       200:
         *         description: Login successful
         *       401:
         *         description: Invalid credentials
         */
        router.post('/auth/login', validateLoginUser, this.userController.login.bind(this.userController));

        /**
         * @swagger
         * /users/{id}:
         *   put:
         *     summary: Update a user (admin only)
         *     tags: [Users]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: User ID
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *               email:
         *                 type: string
         *     responses:
         *       200:
         *         description: User successfully updated
         *       404:
         *         description: User not found
         */
        router.put('/users/:id', authJwt.verifyToken, validateUpdateUser, this.userController.updateUserByAdmin.bind(this.userController));

        /**
         * @swagger
         * /user/me:
         *   put:
         *     summary: Update current logged-in user
         *     tags: [Users]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *               email:
         *                 type: string
         *     responses:
         *       200:
         *         description: User successfully updated
         *       401:
         *         description: Unauthorized
         */
        router.put('/user/me', authJwt.verifyToken, validateUpdateUser, this.userController.updateUserByConnectUser.bind(this.userController));

        /**
         * @swagger
         * /users/{id}:
         *   delete:
         *     summary: Delete a user (admin only)
         *     tags: [Users]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: User ID
         *     responses:
         *       200:
         *         description: User successfully deleted
         *       404:
         *         description: User not found
         */
        router.delete('/users/:id', authJwt.verifyToken, this.userController.deleteUser.bind(this.userController));

        /**
         * @swagger
         * /users/password:
         *   patch:
         *     summary: Change the current user's password
         *     tags: [Users]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               currentPassword:
         *                 type: string
         *               newPassword:
         *                 type: string
         *     responses:
         *       200:
         *         description: Password successfully changed
         *       400:
         *         description: Invalid input data
         *       401:
         *         description: Unauthorized
         */
        router.patch('/users/password', authJwt.verifyToken, validateChangePassword, this.userController.changePassword.bind(this.userController));

        return router;
    }
}
