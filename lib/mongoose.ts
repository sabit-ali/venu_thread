import mongoose from 'mongoose'
import { DB_NAME } from './constancename'

type connectionObject = {
    isConnection? : number
}

const connection:connectionObject = {}

export const ConnectToDB = async () => {
    mongoose.set("strictQuery", true)
    mongoose.set('strictPopulate', false);

    if(connection.isConnection){
        console.log(`mongoDb already connected to server !`)
    }
   
        try {
            const db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
                connection.isConnection =  db.connection.readyState
                console.log('Connected to MongoDB')
        } catch (error:any) {
            throw new Error('MongoDB connection Error',error)
        }

}