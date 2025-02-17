require('dotenv').config()
const express=require('express')
const cors=require('cors')
const paypal=require('./config/payconfig')
const router=require('./Routes/route')
require('./connection/db')
const mentalhealthserver=express()
mentalhealthserver.use(cors())
mentalhealthserver.use(express.json())
mentalhealthserver.use(router)
mentalhealthserver.use('/uploads',express.static('./uploads'))
const PORT=3000 || process.env.PORT
mentalhealthserver.listen(PORT,()=>{
    console.log("server is running at:", PORT)
})
mentalhealthserver.get('/',(req,res)=>{
    res.send("<h1>server is active</h1>")
})