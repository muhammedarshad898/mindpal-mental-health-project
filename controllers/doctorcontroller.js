const doctormodel=require('../models/doctormodel')
const usermodel=require('../models/usersmodel')

const appointmentmodel = require('../models/appointmentmodel');


exports.addDoctor=async(req,res)=>{
    try{
        const{username,qualification,fee,experience,bio,email,specialization}=req.body
        const image=req.file.filename
        const adminId=req.payload.userid
        const adminuser=await usermodel.findById(adminId)
        if(!adminuser||adminuser.role!=='admin'){
            return res.status(400).json("Unauthorized: Only admins can add doctors.")
        }

        const newDoctor=new doctormodel({
         username,qualification,fee,experience,bio,image,adminId,email,specialization
     
        })
        await newDoctor.save()
        res.status(201).json(newDoctor)

    }
    catch(err){
        console.log(err)
        res.status(400).json(err)
    }
  
}
exports.getdoctor=async(req,res)=>{
    try{
        
        const newDoctor=await doctormodel.find()
        res.status(200).json(newDoctor)

    }
    catch(err){
        console.log(err)
        res.status(400).json(err)
    }
  
   

}
exports.getdoctorByid=async(req,res)=>{
    try{
        const {doctorid}=req.params
        const doctor=await doctormodel.findById(doctorid)
        res.status(200).json(doctor)

    }
    catch(err){
        console.log(err)
        res.status(400).json(err)
    }
}
exports.getdoctorbyspecialization=async(req,res)=>{
    try{
        const{specialization}=req.params
        const doctor=await doctormodel.find({specialization:specialization})
        res.status(200).json(doctor)

    }
    catch(err){
        console.log(err)
        res.status(400).json(err)
    }
}
exports.deletedoctor=async(req,res)=>{
    try{
        const{doctorid}=req.params
        const doctor=await doctormodel.findByIdAndDelete(doctorid)
        res.status(200).json(doctor)

    }
    catch(err){
        console.log(err)
        res.status(400).json(err)
    }
   
}
exports.editdoctor=async(req,res)=>{
    try{
        const{doctorid}=req.params
        // const adminId=req.payload.userid
        // const adminuser=await usermodel.findById(adminId)
        // if(!adminuser||adminuser.role!=='admin'){
        //     return res.status(400).json("Unauthorized: Only admins can edit doctors.")
        // }
        if(req.file){
            var image=req.file.filename
            var{username,qualification,fee,experience,bio,email,specialization}=req.body

        }
        else{
            var{username,qualification,fee,experience,bio,email,specialization,image}=req.body

        }
        const doctor=await doctormodel.findByIdAndUpdate(doctorid,{username,qualification,fee,experience,bio,email,specialization,image})
        
        res.status(200).json(doctor)
    }
    catch(err){
        console.log(err)
        res.status(400).json(err)
    }
}




exports.getDoctorDashboard = async (req, res) => {
    try {
        const doctorUserId = req.payload.userid; // Extract doctor ID from JWT token

        // Fetch the doctor's email from the user model
        const doctorUser = await usermodel.findById(doctorUserId);
        if (!doctorUser || doctorUser.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found or unauthorized' });
        }

        // Find doctor details using email
        const doctorDetails = await doctormodel.findOne({ email: doctorUser.email });
        if (!doctorDetails) {
            return res.status(404).json({ message: 'Doctor details not found' });
        }

        // Fetch doctor's appointments
        const appointments = await appointmentmodel.find({ doctorid: doctorDetails._id });

        res.status(200).json({ doctor: doctorDetails, appointments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
