const mongoose=require('mongoose')

const appointmentSchema=new mongoose.Schema({
   
    userid:{
        type:String,
        required:true
    },
    doctorid: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId for referencing
        ref: 'doctors', // Reference the Doctor model
        required: true
    },
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true

    },
    mobile:{
        type:String,
        required:true
       
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    }

})

const appointmentmodel=mongoose.model('appointmentmodel',appointmentSchema)
module.exports=appointmentmodel