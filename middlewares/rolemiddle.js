const roleCheck=(roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.payload.role)){
            return res.status(400).json("access Denied")
        }
        next()
    }
}
module.exports=roleCheck
