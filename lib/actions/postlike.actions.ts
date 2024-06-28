import Like from "../models/like.model";


export async function setLikes(currentUserId:string){
    try {
       const likepost = await Like.findByIdAndUpdate(
        {id:currentUserId},
        {
            $addToSet:{like : currentUserId}
        },
        {new:true}
       )


       return likepost

    } catch (error) {
        
    }
}