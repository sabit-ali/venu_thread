"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.models"
import { ConnectToDB } from "../mongoose"
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";
import { TypeOf } from "zod";


interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    ConnectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId:string){
    ConnectToDB()

    try {
      return await User.findOne({id:userId})
    } catch (error:any) {
      throw new Error(`fetch create-Thread Error : ${error.message}`)
    }
}

export async function fetchUserPosts(userId:string){
  await ConnectToDB();

  try {
    const threads = await User.findOne({id : userId})
    .populate({
      path:'threads',
      model : Thread, 
      populate:{
        path: 'children',
        model:Thread,
        populate:{
          path:'author',
          model:User,
          select:' name, image, id'
        }
      }
    })
    return threads
  } catch (error:any) {
    throw new Error(`Error to fetchUserPosts : ${error.message}`)
  }
}

export async function fetchUsers({
  userId,
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortby = 'desc',
}:{
  userId:string,
  searchString?:string,
  pageNumber?:number,
  pageSize?:number,
  sortby ?: SortOrder,
}){
  await ConnectToDB();
  try {
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, 'i')

    const query:FilterQuery<typeof User> = {
      id : {$ne : userId}
    }

    if(searchString.trim() !== ''){
      query.$or = [
        {username : {$regex : regex}},
        {name : {$regex : regex}}

      ]
    }

    const sortOptions = {createdAt : sortby}
    const usersQuery = User.find(query)
    .sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize)

   const totalUsersCount = await User.countDocuments(query)

   const users = await usersQuery.exec()

  const isNext = totalUsersCount > skipAmount + User.length;

  return {users, isNext}
  } catch (error:any) {
    throw new Error(`Error FetchUsers : ${error.message}`)
  }
}

export async function getActivity(userId: string) {
  try {
    await ConnectToDB();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}