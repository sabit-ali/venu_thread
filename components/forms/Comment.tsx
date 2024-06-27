
'use client'

import { CommentValidation, ThreadValidation } from '@/lib/validation/thread'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import {useForm} from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import * as z from 'zod'
// import { addCommentToThread, createThread } from '@/lib/actions/createThread'

import { usePathname, useRouter  } from 'next/navigation'
import Image from 'next/image'
import { Input } from '../ui/input'
import { userInfo } from 'os'
import { addCommentToThread , createThread} from '@/lib/actions/createThread.actions'


interface Props {
    threadId: string,
    currentUserImage: string,
    currentUserId: string

}
const Comment = (
    {
        threadId,
        currentUserImage,
        currentUserId,
    }: Props
) => {
    const pathname = usePathname()
    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToThread(
            threadId,
            values.thread,
            JSON.parse(currentUserId),
            pathname
        )

        form.reset()
    }
    return (
        <Form  {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='comment-form '>
                <FormField
                    control={form.control}
                    name='thread'
                    render={({ field }) => (
                        <FormItem className='flex w-full items-center gap-3'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                <Image
                                    src={currentUserImage}
                                    alt='Profile image'
                                    width={48}
                                    height={48}
                                    className='rounded-full object-cover'

                                />
                            </FormLabel>
                            <FormControl className='border-none bg-transparent'>
                                <Input
                                    type='text'
                                    placeholder='comment...'
                                    className=' outline-none text-light-1 no-focus'
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type='submit' className=' comment-form_btn'>
                    reply
                </Button>
            </form>
        </Form>
    )
}

export default Comment
