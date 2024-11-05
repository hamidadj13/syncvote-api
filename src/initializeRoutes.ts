import * as controllers from './controllers';
import * as routes from './routes';
import * as services from './services';
import { FirestoreCollections } from './types/firestore';
import { RedisClientType } from 'redis';


export function initializeRoutes(db: FirestoreCollections, redisClient: RedisClientType) {
    
    const usersService = new services.UsersService(db, redisClient );
    const userController = new controllers.UserController(usersService);
    const usersRoute = new routes.UsersRoute(userController);

    const postsService = new services.PostsService(db);
    const postsController = new controllers.PostsController(postsService);
    const postsRoute = new routes.PostsRoute(postsController);

    const commentsService = new services.CommentsService(db);
    const commentsController = new controllers.CommentsController(commentsService);
    const commentsRoute = new routes.CommentsRoute(commentsController);

    const votesService = new services.VotesService(db);
    const votesController = new controllers.VotesController(votesService);
    const votesRoute = new routes.VotesRoute(votesController);

    return {
        usersRoute, 
        postsRoute,
        commentsRoute,
        votesRoute
    };
}
  