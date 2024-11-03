import { Request, Response } from 'express';
import { UsersService } from '../services';
import { validationResult } from 'express-validator';

export class UserController {
    private usersServices: UsersService

    constructor(usersService: UsersService) {
        this.usersServices = usersService
    }

    async createUser(request:Request, response:Response): Promise<void>{
        const errors = validationResult(request);

        if (!errors.isEmpty()){
            response.status(400).json({
                status: 400,
                messsage: 'Errors to fix these errors!!',
                data: errors.array(),
            });
        } else {
            try{
                const { email, password, username } = request.body; 

                const userData = { email, password, username }
                
                const userResponse = await this.usersServices.createUser(userData);

                response.status(userResponse.status).send({
                    ...userResponse
                });
            } catch (error) {
                response.status(500).json({
                    status: 500,
                    message: 'Internal server Error !!',
                    data: error
                });
            }
        }      
    }

    async getUsers(request:Request, response:Response): Promise<void>{
        try{
            const userResponse = await this.usersServices.getUsers();

            response.status(userResponse.status).send({
                ...userResponse
            });
        } catch (error) {
            response.status(500).json({
                status: 500,
                message: 'Internal server Error !!',
                data: error
            });
        }    
    }

    async getUserById(request:Request, response:Response): Promise<void>{
        try{
            if (request.params.id) {
                const userResponse = await this.usersServices.getUserById(request.params.id);

                response.status(userResponse.status).send({
                    ...userResponse
                });
                
            } else {
                response.status(404).send({
                    status: 404,
                    message: 'User not found !!',
                });
            }
            
        } catch (error) {
            response.status(500).json({
                status: 500,
                message: 'Internal server Error !!',
                data: error
            });
        }    
    }

    async login(request:Request, response:Response): Promise<void>{
        const errors = validationResult(request);

        if (!errors.isEmpty()){
            response.status(400).json({
                status: 400,
                messsage: 'Bad Request',
                data: errors.array(),
            });
        } else {
            try{

                const { email, password } = request.body;

                const userData = { email, password };

                const userResponse = await this.usersServices.login(userData);
    
                response.status(userResponse.status).send({
                    ...userResponse
                });
            } catch (error) {
                response.status(500).json({
                    status: 500,
                    message: 'Internal server Error !!',
                    data: error
                });
            } 
        }      
    }

    async updateUserByAdmin(request: Request, response: Response): Promise<void> {

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            response.status(400).json({
                status: 400,
                message: 'Please fix these errors !!',
                data: errors.array(),
            });
            
        }
        const userRole = request.userRole;

        if (userRole != "admin") {
            response.status(401).json({
                status: 401,
                message: 'Please login with an admin account to make this action !!',
            });
        }

        const email = request.body.email;
        const username = request.body.username;
        const role = request.body.role;

        if (!email && !username && !role) {
            response.status(400).json({
                status: 400,
                message: 'Please enter at least one valid field to update !!',
            });
        } 
       
    
        try {
            const userId = request.params.id;


            const userData = request.body
                
            const userResponse = await this.usersServices.updateUser(userId, userData);

            response.status(userResponse.status).send({
                ...userResponse
            });
        } catch (error) {
            response.status(500).json({
                status: 500,
                message: 'Internal server Error !!',
                data: error
            });
        }
    }

    async updateUserByConnectUser(request: Request, response: Response): Promise<void> {

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            response.status(400).json({
                status: 400,
                message: 'Please fix these errors !!',
                data: errors.array(),
            });
            
        }
        const email = request.body.email;
        const username = request.body.username;

        if (!email && !username) {
            response.status(400).json({
                status: 400,
                message: 'Please enter at least one valid field to update !!',
            });
        } 
    
        try {
            const userId = request.userId as string;


            const userData = request.body
                
            const userResponse = await this.usersServices.updateUser(userId, userData);

            response.status(userResponse.status).send({
                ...userResponse
            });
        } catch (error) {
            response.status(500).json({
                status: 500,
                message: 'Internal server Error !!',
                data: error
            });
        }
    }

    async deleteUser(request: Request, response: Response): Promise<void> {

        const userRole = request.userRole;

        const userId = request.params.id;

        if (userRole != "admin") {
            response.status(401).json({
                status: 401,
                message: 'Please login with an admin account to make this action !!',
            });
        }

        try {
            const userResponse = await this.usersServices.deleteUser(userId);

            response.status(userResponse.status).json({
                ...userResponse,
            });
        } catch (error) {
            response.status(500).json({
                status: 500,
                message: 'Erreur interne du serveur',
                data: error,
            });
        }
    }

    async changePassword(request: Request, response: Response): Promise<void> {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            response.status(400).json({
                status: 400,
                message: 'Please fix these errors !!',
                data: errors.array(),
            });
            
        }

        const { oldPassword, newPassword } = request.body;
        const userId = request.userId as string; // On suppose que `userId` est défini par le middleware d'authentification

        try {
            const userResponse = await this.usersServices.changePassword(userId, oldPassword, newPassword);

            response.status(userResponse.status).json({
                ...userResponse,
            });
        } catch (error) {
            response.status(500).json({
                status: 500,
                message: 'Internal server error',
                data: error,
            });
        }
    }
}