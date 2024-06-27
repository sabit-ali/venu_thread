import UserCard from '@/components/cards/UserCard'
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import React from 'react'

export default async function page() {
  const user = await currentUser()
  if(!user) return null

  const userInfo = await fetchUser(user.id)

  if(!userInfo.onboarded) redirect('/onboarding')

    const result = await fetchUsers({
      userId : user.id,
      searchString : '',
      pageNumber : 1,
      pageSize  :25,

    })

  return (
    <section>
      <div  className=' flex gap-9 mt-14 flex-col'>
        {result.users.length === 0 ? (
          <p className=' no-result'>no Users</p>
        ) :(
          <>
            {result.users.map((person)=>(
              <UserCard
                key= {person.id}
                id = {person.id}
                name = {person.name}
                username ={person.username}
                imgUrl = {person.image}
                personType = 'User'
                
              />
            ))}
          </>
        )}
      </div>
    </section>
  )
}
