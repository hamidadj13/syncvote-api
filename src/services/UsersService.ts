import { User } from '../types/entities/User';
import { IResBody } from '../types/api'

import { FirestoreCollections } from '../types/firestore';
import { firestoreTimestamp } from '../utils/firestore-helpers';

import { encryptPassword }  from '../utils/password';
import { comparePasswords } from '../utils/password';
import { generateToken } from '../utils/jwt';

import { formatUserData } from '../utils/formatData';
import { doc } from 'firebase/firestore';
import { RedisClientType } from 'redis';



export class UsersService {
    private db: FirestoreCollections;
    private redisClient: RedisClientType;

    constructor(db: FirestoreCollections, redisClient: RedisClientType) {
        this.db = db;
        this.redisClient = redisClient;
    }

    async createUser(userData: User): Promise<IResBody> {
      
        //Create user
        const usersQuerySnapshot = await this.db.users.where('email', '==', userData.email).get();

        if (usersQuerySnapshot.empty){
            const  userRef = this.db.users.doc();
            await userRef.set({
                ...userData,
                password: encryptPassword(userData.password as string),
                role: 'member',
                createdAt: firestoreTimestamp.now(),
                updatedAt: firestoreTimestamp.now(),
            });

            return {
                status: 201,
                message: 'User created successfully !'

            }
        } else {
            return {
                status: 409,
                message: 'User already exists !'
            }
        }
        
    }

    async getUsers(): Promise<IResBody> {
      
        const cacheKey = 'users';

        let users: User[] = [];

        const cacheUsers = await this.redisClient.get(cacheKey);

        if (cacheUsers) {
            users = JSON.parse(cacheUsers);

        } else {
            const usersQuerySnapshot = await this.db.users.get();

            for (const doc of usersQuerySnapshot.docs) {
                const formattedUser = formatUserData(doc.data())
    
                users.push({
                    id: doc.id,
                    ...formattedUser,
                });
            }   
        }

        

        await this.redisClient.set(cacheKey, JSON.stringify(users), {
            EX: 60
        })

        return {
            status: 200,
            message: 'Users retrieved successfully !',
            data: users
        }
  
    }

    async getUserById(userId: string): Promise<IResBody> {
      
        const usersQuerySnapshot = await this.db.users.doc(userId).get();

        const formattedUser = formatUserData(usersQuerySnapshot.data())

        return {
            status: 200,
            message: 'User retrieved successfully !',
            data: {
                id: userId,
                ...formattedUser
            }
        }
  
    }

    async login(userData:{email: string, password: string}): Promise<IResBody>  {
        const { email, password } = userData

        const usersQuerySnapshot = await this.db.users.where('email', '==', userData.email).get();

        if (usersQuerySnapshot.empty){
            return {
                status:401,
                message: 'User not found !!',
            }
        } else {
            const isPasswordValid = comparePasswords(
                password,
                usersQuerySnapshot.docs[0].data().password as string
            );

            if (isPasswordValid) {
                const formattedUser = formatUserData(usersQuerySnapshot.docs[0].data());

                return {
                    status: 200,
                    message: 'User logged successfully',
                    data: {
                        user: {
                            ...formattedUser
                        },
                        token: generateToken(usersQuerySnapshot.docs[0].id, formattedUser.role),
                    }
                }  
            } else {
                return {
                    status: 401,
                    message: 'Unauthorized'
                }
            }
        }
    }

    async updateUser(userId: string, updatedData: Partial<User>): Promise<IResBody> {
        
        const userRef = this.db.users.doc(userId);
        const userDoc = await userRef.get();

        // Vérification de l'existence de l'utilisateur
        if (!userDoc.exists) {
            return {
                status: 404,
                message: 'User not found'
            };
        }

        // Mise à jour des informations de l'utilisateur
        const dataToUpdate = {
            ...updatedData,
            updatedAt: firestoreTimestamp.now(),
        };

        await userRef.update(dataToUpdate);

        // Rafraîchissement du cache Redis pour la clé 'users'
        const usersCacheKey = 'users';
        await this.redisClient.del(usersCacheKey);

        return {
            status: 200,
            message: 'User updated successfully !!'
        };

        
    }

    async deleteUser(userId: string): Promise<IResBody> {

        const userRef = this.db.users.doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return {
                status: 404,
                message: 'User not found !!'
            };
        }

        await userRef.delete();

        // Rafraîchir le cache Redis pour la liste des utilisateurs
        const usersCacheKey = 'users';
        await this.redisClient.del(usersCacheKey);

        return {
            status: 200,
            message: 'User deleted successfully'
        };
        
    }
        
    async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<IResBody> {

        const userRef = this.db.users.doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return {
                status: 404,
                message: 'User not found !!'
            };
        }

        const userData = userDoc.data() as User;

        // Vérifie si l'ancien mot de passe est correct
        const isOldPasswordValid = comparePasswords(oldPassword, userData.password as string);
        if (!isOldPasswordValid) {
            return {
                status: 400,
                message: 'The old password is incorrect'
            };
        }

        // Met à jour le mot de passe
        await userRef.update({
            password: encryptPassword(newPassword),
            updatedAt: firestoreTimestamp.now()
        });

        return {
            status: 200,
            message: 'Password updated succcessfully !!'
        };
    }
}