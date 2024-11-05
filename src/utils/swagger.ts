// src/config/swagger.ts

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions: swaggerJsDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentation de l\'API pour gérer les posts, commentaires, et votes',
            contact: {
                name: 'Hamid OKETOKOUN',
                email: 'hamidoketokoun@estiam.com',
            },
        },
        // Vous pouvez omettre 'servers' pour l'instant ou ajouter des serveurs plus tard
    },
    apis: ['./src/routes/*.ts'], // Chemin vers les fichiers de route
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };
