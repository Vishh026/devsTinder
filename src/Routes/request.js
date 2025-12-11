const express = require('express')
const requestRouter = express.Router()
const {userAuth} = require("../middlewares/auth.middleware")

requestRouter.get('/sendConnectionRequest',userAuth,async(req,res) => {
    try{
        const user = req.user;
        
        res.status(200).send(user.firstName + " " + "sends a connections request!")
    }catch(err){
        res.status(400).send("ERR:",err.message)
    }
})

module.exports = requestRouter