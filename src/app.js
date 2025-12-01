const express = require('express')

const app =  express()

app.get("/",(req,res)=> {
    res.send("welcome to Devtinder")
})

app.get("/test",(req,res)=> {
    res.send("testing on application.....")
})

app.get("/work",(req,res)=> {
    res.send("workkig.....")
})

app.listen(7777,() => {
    console.log("server listening on port 7777");   
})