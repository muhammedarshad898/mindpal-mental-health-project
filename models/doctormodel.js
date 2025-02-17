const mongoose=require('mongoose')

const doctorSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
   
    qualification:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    fee:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    adminId:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    specialization:{
        type:String,
        required:true
    }
    // slots:{
    //     type:[
    //         {
    //             date:String,
    //             time:String,
    //             booked:{type:Boolean,default:false}
    //         }
    //     ],
    //     default:[]
    // }

    


})

const doctormodel=mongoose.model('doctors',doctorSchema)
module.exports=doctormodel
