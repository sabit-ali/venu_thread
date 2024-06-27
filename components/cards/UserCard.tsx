'use client'

import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

interface Props {
    id:string,
    name:string,
    username:string,
    imgUrl : string,
    personType:string
}

export default function UserCard({
    id,
    name,
    username,
    imgUrl,
    personType,
}:Props) {
    const router = useRouter()
  return (
    <article className=' user-card'>
        <div className=' user-card_avatar'>
         
           <Image
            src={imgUrl}
            alt = "Profile img"
            height={20}
            width={20}
            className=' rounded-full object-cover'
            />
           
            <div className=' flex-1 text-ellipsis'>
                <h2 className=' text-light-1 text-base-semibold'> {name} </h2>
                <h2 className=' text-gray-1 text-small-medium'>@{name} </h2>
            </div>

            <Button className=' user-card_btn' onClick={()=> router.push(`/profile/${id}`)}>
                View
            </Button>
        </div>
    </article>
  )
}
