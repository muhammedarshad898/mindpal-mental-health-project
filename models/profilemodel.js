const mongoose=require('mongoose')

const profileSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true,
      

    },
    bio:{
        type:String,
        required:true

    },
    image:{
        type:String,
        required:true

    },
    userid:{
        type:String,
        required:true
    }

})

const profilemodel=mongoose.model('profile',profileSchema)
module.exports=profilemodel