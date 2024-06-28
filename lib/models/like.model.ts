import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    like:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'Like'
    }
},{timestamps:true})


const Like = mongoose.models.Like || mongoose.model('Like',likeSchema)

export default Like