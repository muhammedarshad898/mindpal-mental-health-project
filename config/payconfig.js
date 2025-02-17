const paypal=require("paypal-rest-sdk")
require("dotenv").config()
paypal.configure({
    mode:"sandbox",
    client_id:process.env.paypal_clientid,
    client_secret:process.env.paypal_secretkey

})
module.exports=paypal