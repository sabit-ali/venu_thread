import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { fetchUser, getActivity } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

async function page() {
  const user = await currentUser()
  if(!user) return null
  const userInfo = await fetchUser(user.id)

  if(!userInfo?.onboarded)  redirect('/onboarding')
     //get activity 
    const activity = await getActivity(userInfo._id)

  return (
    <section>
      <section className=' mt-10 flex flex-col gap-5'>
        {activity.length > 0 ?(
          <>
            {activity.map((activity)=>(
              <Link href={`/thread/${activity.parentId}`}
                key={activity._id}
                className=''>
              <article className=' activity-card'>
                <div className=' relative h-14 w-14 '>
                <Image
                  fill
                  src={activity.author.image}
                  alt='profile picture'
                  className=' object-cover rounded-full'
                />
                </div>
                <p className=' text-light-1 !text-base-regular '>
                  <span className=' mr-1 text-primary-500'>
                    {activity.author.name}
                  </span>{ " " } 
                  replied to your thread
                </p>
              </article>
              </Link>
            ))}
          </>
        ): (<>
              <p className='!text-base-regular text-light-3'>Not activity found !</p>
            </>)}
      </section>
    </section>
  )
}

export default page
