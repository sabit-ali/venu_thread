'use client'

import { CommentValidation, ThreadValidation } from '@/lib/validation/thread'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import {useForm} from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import * as z from 'zod'
import { createThread } from '@/lib/actions/createThread.actions'
import { usePathname, useRouter  } from 'next/navigation'


export default function PostThread({userId}:{userId : string}) {
    const pathname = usePathname()
    const router = useRouter()
    const form = useForm({
        resolver :zodResolver(ThreadValidation),
        defaultValues:{
            thread : '',
            accountId : userId,
        }
    })

    const onSubmit = async (values : z.infer<typeof ThreadValidation>)=>{
        await createThread({
            text:values.thread,
            author :userId,
            communityId :null,
            path : pathname
        })
        router.push('/')
    }

  return (
    <Form  {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}  className=' mt-10 flex flex-col justify-start gap-10 '>
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Content
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={15}
                  className='border border-dark-4 bg-dark-3 text-light-1 no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className=' bg-primary-500'>
          post thread
        </Button>
        </form>
    </Form>
  )
}
