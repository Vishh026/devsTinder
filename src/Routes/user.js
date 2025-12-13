const express = require('express')
const userRouter = express.Router()
const User = require("../models/user.model")

// pending all requeest = pending 




//  => get the loggedinuser
//  => find =>  1.ttouserID === loggedinuser  2.status= "interested"
//  => we get all data but we got id's => for showing data in the frontend what we need
//     => all user's data ?? how to fetch the data ??
//         1) findeach user and get teh data from database  (poor way)
//         2) fromUserId : { ref : 'UseraModel'},
//             .populate("fromUserId" ,["firstname lastname age gender"])




// get all connection => (1:1)
//  => get the logginuser
//  => findout  => fromuserid and touserid (accepted) => or  => populate
// [removing id,update at and other stuff ] map on fromuserid info which is taken from the populate


module.exports = userRouter