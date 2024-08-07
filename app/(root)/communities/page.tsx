import CommunityCard from '@/components/cards/CommunityCard'
import UserCard from '@/components/cards/UserCard'
import { fetchCommunities } from '@/lib/actions/community.actions'
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import React from 'react'

export default async function page() {
  const user = await currentUser()
  if(!user) return (
    <>
      <div className=' flex flex-col justify-between items-center '>
          <h1 className=' text-light-2'>User not Sign-in</h1>
      </div>
    </>
  )

  const userInfo = await fetchUser(user.id)
  //todo setLikes
  if(!userInfo?.onboarded) redirect('/onboarding')

    // fetch communityis
    const result = await fetchCommunities({
      searchString : '',
      pageNumber : 1,
      pageSize  :25,

    })

  return (
    <section>
      <div  className=' flex gap-9 mt-14 flex-col'>
        {result.communities.length === 0 ? (
          <p className=' no-result'>no Users</p>
        ) :(
          <>
            {result.communities.map((community)=>(
              <CommunityCard
                key= {community.id}
                id = {community.id}
                name = {community.name}
                username ={community.username}
                imgUrl = {community.image}
                bio = {community.bio}
                members = {community.members}
                
                
              />
            ))}
          </>
        )}
      </div>
    </section>
  )
}
