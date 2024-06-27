import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { fetchUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import ThreadCard from '@/components/cards/ThreadCard'
import { fetchThreadById } from '@/lib/actions/createThread.actions'
import Comment from '@/components/forms/Comment'

export default  async function page({params}:{params : {id:string}}) {
  if(!params.id) return null

  const user = await currentUser()
  if(!user) return null

  const userInfo = await fetchUser(user.id)
  if(!userInfo?.onboarded) return redirect('/onboarding')

    const thread = await fetchThreadById(params.id)
  return (
    <section className=' relative'>
      <div>
      <ThreadCard 
            key = {thread._id}
            id = {thread._id}
            currentUserId = {user?.id || ""}
            parentId={thread.parentId}
            author = {thread.author}
            community = {thread.community}
            content = {thread.text}
            createdAt = {thread.createdAt}
            comments = {thread.children}
            />
      </div>

      <div className=' mt-7'>
        <Comment
          threadId={thread.id}
          currentUserImage={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className=' mt-10'>
        {thread.children.map((post:any)=>(
          <ThreadCard 
          key = {post._id}
          id = {post._id}
          currentUserId = {user?.id || ""}
          parentId={post.parentId}
          author = {post.author}
          community = {post.community}
          content = {post.text}
          createdAt = {post.createdAt}
          comments = {post.children}
          isComment
          />
        ))}
      </div>
    </section>
  )
}
