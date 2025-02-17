const users=require('../models/usersmodel')
const jwt=require('jsonwebtoken')
const bycrypt=require('bcrypt')

exports.userRegister=async(req,res)=>{
    try{
        const{username,password,email,role}=req.body
    if(!username||!password||!email){
        res.status(406).json("invalid data")
    }
    
    else{
        const existingemail= await users.findOne({email})
        if(existingemail){
            return res.status(400).json("Email is Already used")
        }
        
        else{
            let userRole="user"
            if(role){
                if(role==="admin"){
                    return res.status(400).json("Admin cant register")
                }
                else if(role==="doctor"){
                    userRole="doctor"

                }
                else{
                     return res.status(400).json({message:"invalid role"})
                }
            }
            let encpassword= await bycrypt.hash(password,10)
            const newusers=new users({username,password:encpassword,email,role:userRole})
        await newusers.save()
         return res.status(201).json(newusers)

        }
        
    }

    }
    catch(err){
        console.log(err)
        res.status(400).json(err)

    }
    
}

exports.userlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existinguser = await users.findOne({ email });

        if (existinguser) {
            const ismatch = await bycrypt.compare(password, existinguser.password);
            if (ismatch || password == existinguser.password) {
                const token = jwt.sign({ userid: existinguser._id, role: existinguser.role }, process.env.secret_key);

                // Include userid in the response
                res.status(200).json({
                    token,
                    userid: existinguser._id, // Add this line
                    username: existinguser.username,
                    role: existinguser.role
                });
            } else {
                res.status(400).json("Invalid password");
            }
        } else {
            res.status(400).json("Invalid email");
        }
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
};