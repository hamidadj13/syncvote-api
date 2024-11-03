import { User } from "../types/entities/User";
import { Post } from "../types/entities/Post";

export const formatUserData = (userData?: User ): Partial<User> => {
    if (userData){
        const _user = { ...userData } // Ne pas faire const _user = userData  parce que ça ne crée pas vraiment le duplicatat de userData        
        
        delete _user.password;
        delete _user.createdAt;
        delete _user.updatedAt;

        return _user;
    }
    return {};
}

export const formatPostData = (postData?: Post ): Partial<Post> => {
    if (postData){
        const _post = { ...postData } // Ne pas faire const _user = userData  parce que ça ne crée pas vraiment le duplicatat de userData        
        
    
        delete _post.updatedAt;

        return _post;
    }
    return {};
}