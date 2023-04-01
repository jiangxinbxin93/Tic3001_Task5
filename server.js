require('dotenv').config()

const express= require('express')
const app=express()

const cors=require('cors');


//connect to database
const mongoose=require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
const db=mongoose.connection
db.on('error',(error)=>console.error(error))
db.once('open',()=>console.log("Connected to Database"))

app.use(express.json())
app.use(cors());

const contactRouter= require('./routes/contactData.js')
app.use('/particular',contactRouter)


app.listen(3000,()=>console.log("Server started"));