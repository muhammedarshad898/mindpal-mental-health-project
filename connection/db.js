const mongoose=require('mongoose')
const ConnectionString=process.env.Database

mongoose.connect(ConnectionString).then(res=>{
    console.log("server is Connected to the MongoDB")
}).catch(err=>{
    console.log(err)
})