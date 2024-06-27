import {z} from 'zod'

export const UserValidation = z.object({
    profile_photo : z
                    .string()
                    .url(),
    name: z
        .string()
        .min(3,{message:'atlest 3 characters is allowed'})
        .max(20,{message:'no more then 20 characters '}),
    username : z
            .string()
            .min(3,{message:'atlest 3 characters is allowed'})
            .max(20,{message:'no more then 20 characters '}),
    bio:z
        .string()
        .min(3,{message : 'min 3 words...,'})
        .max(1000,{message:'no more then 1000  words'})
        
})