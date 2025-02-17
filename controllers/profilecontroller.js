const profilemodel=require('../models/profilemodel')

exports.addprofile=async(req,res)=>{
    try{
        const{userid}=req.payload
        const {username,email,bio}=req.body
        const image=req.file.filename

        const profile=new profilemodel({username,email,bio,image,userid})
        await profile.save()
        res.status(201).json(profile)

    }
    catch(err){
        console.log(err)
        res.status(400).json(err)

    }
  

} 
exports.getprofile=async(req,res)=>{
    try{
        const{userid}=req.params
        const profile=await profilemodel.find({userid})
        res.status(200).json(profile)

    }
    catch(err){
        console.log(err)
        res.status(400).json(err)

    }
}

exports.getprofileonlanding=async(req,res)=>{
    try{
        const profile=await profilemodel.find()
        res.status(200).json(profile)

    }
    catch(err){
        console.log(err)
        res.status(400).json(err)

    }
}
exports.updateProfile = async (req, res) => {
    try {
        const { userid } = req.payload; 
        const { username, email, bio } = req.body;
        let updateFields = { username, email, bio };

       
        if (req.file) {
            updateFields.image = req.file.filename;
        }

       
        const updatedProfile = await profilemodel.findOneAndUpdate(
            { userid },
            { $set: updateFields },
            { new: true } 
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json(updatedProfile);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
};
