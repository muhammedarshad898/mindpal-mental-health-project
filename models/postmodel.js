const mongoose=require('mongoose')

const postSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        required:true
    },
    thought:{
        type:String,
        required:true
    },
   
    userid:{
        type:String,
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId, ref: "users"
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }]
})

const postmodel=mongoose.model('posts',postSchema)
module.exports=postmodel