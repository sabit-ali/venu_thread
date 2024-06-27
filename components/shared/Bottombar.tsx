'use client'

import React from 'react'
import { sidebarLinks } from '@/constants'
import { usePathname,useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function Bottombar() {
  const pathname = usePathname()
  const router = useRouter()
  return (
    <div className='bottombar'>
      <div className='bottombar_container'>
        {sidebarLinks.map((link) => {

          const isActive = (
            pathname.includes(link.route) && link.route.length > 1 ||
            pathname === link.route
          )
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottombar_link ${isActive && "bg-primary-500"}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                height={24}
                width={24}
              />
              <p className=' text-subtle-medium max-sm:hidden text-light-1'>
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
