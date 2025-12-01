const express = require('express')
const connectDb = require('./config/database')

const app =  express()

connectDb().then(()=> {
    console.log('Database connected successfully')
    app.listen(7777,()=> {
    console.log('Server is running on port 7777')
})
}).catch((err)=> {
    console.log('Database connection failed', err)
})




