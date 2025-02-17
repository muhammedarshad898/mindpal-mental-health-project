const jwt=require('jsonwebtoken')

const jwtverificationmiddle=async(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1]
    const result=jwt.verify(token,process.env.secret_key)
    console.log(result)
    req.payload={userid:result.userid,role:result.role}
    
    next()

    }
    catch(err){
        console.log(err)
        res.status(400).json(err)

    }
    
}
module.exports=jwtverificationmiddle