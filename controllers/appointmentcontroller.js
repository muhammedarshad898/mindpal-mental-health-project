// 
const appointmentmodel = require('../models/appointmentmodel');

exports.doctorappointment = async (req, res) => {
    try {
        const { name, age, mobile, date, time, doctorid } = req.body;
        const userid = req.payload.userid;

        // Convert time to minutes for easy comparison
        const [hours, minutes] = time.split(":").map(Number);
        const appointmentTimeInMinutes = hours * 60 + minutes;
         // Allowed time range (9:00 AM to 5:00 PM)
         const startTime = 9 * 60;   // 9:00 AM = 540 minutes
         const endTime = 17 * 60;    // 5:00 PM = 1020 minutes
 
         // Check if the appointment time is within the allowed range
         if (appointmentTimeInMinutes < startTime || appointmentTimeInMinutes >= endTime) {
             return res.status(400).json({ 
                 error: "Appointments can only be booked between 9:00 AM and 5:00 PM." 
             });
         }

        // Check if the doctor is already booked at the given date and a conflicting time
        const existingAppointments = await appointmentmodel.find({ doctorid, date });

        // Check if any existing appointment is within 30 minutes of the requested time
        for (const appointment of existingAppointments) {
            const [existingHours, existingMinutes] = appointment.time.split(":").map(Number);
            const existingTimeInMinutes = existingHours * 60 + existingMinutes;

            if (Math.abs(existingTimeInMinutes - appointmentTimeInMinutes) < 30) {
                return res.status(400).json({ 
                    error: "Doctor is already booked within 30 minutes of this time. Please select a different slot." 
                });
            }
        }

     
        const newappointment = new appointmentmodel({ name, age, mobile, date, time, doctorid, userid });
        await newappointment.save();

        return res.status(200).json({ message: "Appointment booked successfully!", appointment: newappointment });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.getmyappointment = async (req, res) => {
    try {
        const userid = req.payload.userid;
        const getappointment = await appointmentmodel.find({ userid }).populate('doctorid', 'username');
        return res.status(200).json(getappointment);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getallappointments=async(req,res)=>{
    try{
        const allapointment=await appointmentmodel.find().populate('doctorid','username email')
        res.status(200).json(allapointment)
        

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.deleteappointment=async(req,res)=>{
    try{
        const {appointmentid}=req.params
        const appointment=await appointmentmodel.findByIdAndDelete(appointmentid)
        res.status(200).json(appointment)

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
