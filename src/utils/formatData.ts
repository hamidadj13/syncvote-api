import { User } from "../types/entities/User";
import { Post } from "../types/entities/Post";
import { Comment } from "../types/entities/Comment";
import { formatTimestamp } from "../utils/formatTimestamp";
import { Timestamp } from "firebase/firestore";

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
        const _post = { ...postData }  as Partial<Post>// Ne pas faire const _user = userData  parce que ça ne crée pas vraiment le duplicatat de userData        
        
        
        delete _post.updatedAt;

        (_post as any).createdDate = formatTimestamp(_post.createdAt as Timestamp)

        delete _post.createdAt;
        return _post;
    }
    return {};
}

export const formatCommentData = (commentData?: Comment ): Partial<Comment> => {
    if (commentData){
        const _comment = { ...commentData }  as Partial<Comment>// Ne pas faire const _user = userData  parce que ça ne crée pas vraiment le duplicatat de userData        
        
        
        delete _comment.updatedAt;

        (_comment as any).createdDate = formatTimestamp(_comment.createdAt as Timestamp)

        delete _comment.createdAt;

        return _comment;
    }
    return {};
}