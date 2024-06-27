"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.models";
import { ConnectToDB } from "../mongoose";



export interface Params{
    text : string,
    author :string,
    communityId:string  | null,
    path :string,
}


export async function createThread({text,author,communityId,path}:Params){
   try {
    const createThread = await Thread.create({
        text,
        author,
        community: null,
    })

    // update user modle,
    await User.findByIdAndUpdate(author,{
        $push : {threads : createThread._id}
    })

    revalidatePath(path)
   } catch (error:any) {
    throw new Error(`createThread Error : ${error.message}`)
   }
}

export async function fetchPosts (pageNumber = 1, pageSize = 20 ){
    ConnectToDB()
    try {
        //calculate the number of posts to skip 
       const skipAmount =  (pageNumber - 1) * pageSize

        // fetch the threads threre have no perentd {top level threads}
      const postsQuery = Thread.find({parentId : {$in : [null , undefined]}})

      .sort({createdAt : "desc"})
      .skip(skipAmount)
      .limit(pageSize)
      .populate({path : "author", model : User})
      .populate({
        path : "children",
        populate :{
            path : 'author',
            model: User,
            select : "_id name parentId image"
        }

      })
      const totalPostsCount = await Thread.countDocuments({parentId : {$in : [null , undefined]}})

        const posts = await postsQuery.exec()
        const isNext = totalPostsCount > skipAmount + posts.length;
      return {posts , isNext}
    } catch (error:any) {
        throw new Error(`fetchThread Error : ${error.message}`)
    }
}

export async function fetchThreadById(id:string) {
    await ConnectToDB()
    try {
        const thread = await Thread.findById(id)
            .populate({
                path : 'author',
                model : User,
                select : '_id id name image'
            })
            .populate({
                path:'children',
                populate : [
                    {
                        path : 'author',
                        model:User,
                        select :'id _id parentId image name'
                    },
                    {
                        path:'children',
                        model:Thread,
                        populate : {
                            path :'author',
                            model:User,
                            select :'id _id parentId image'
                        }

                    }
                ]

            }).exec()
            return thread
    } catch (error:any) {
        throw new Error('not fetch thread by id',error.message)
    }
}

export async function addCommentToThread(
    threadId:string,
    commentText:string,
    userId:string,
    path : string,
){
    ConnectToDB()

    try {
       const originalThread = await Thread.findById(threadId)
       if(!originalThread){
        throw new Error(`Thread not found !`)
       }
       // Create an new Thread with the comment text
       const commentThread = new Thread({
        text:commentText,
        author : userId,
        parentId :threadId
       })

       const saveCommentThread = await commentThread.save()

       // update the original thread to incudes the new comment
       originalThread.children.push(saveCommentThread._id)
       await originalThread.save()

       revalidatePath(path)
    } catch (error:any) {
        throw new Error(`Error Add Commnet : ${error.message}`)
    }
}