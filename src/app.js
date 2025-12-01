const express = require('express')

const app =  express()



app.use("/test",(req,res)=> {
    res.send("testing on application.....")
})


// If the sequence is chnage then the routing is also chnage
// app.use("/",(req,res)=> {
//     res.send("welcome to Devtinder")
// })

// app.get("/abc",(req,res)=> {
//     res.send("this is abc route")
// })

// app.get("/ab*c",(req,res)=> {
//     res.send("b multiplices")   // abbc, abbc, abbbbc
// })



app.listen(7777,() => {
    console.log("server listening on port 7777");   
})

// query parameters = "/api/users?name=John&age=30"
// console.log(req.query)


// for route parameters = "/api/users/:id"
// console.log(req.params)

