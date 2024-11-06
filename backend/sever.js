import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'



//app conig
const app = express()
const port = process.env.PORT || 3000
connectDB()
connectCloudinary()
//middleware
app.use(express.json())
app.use(cors())

app.use('/api/admin',adminRouter)

//apiendpoints
app.get('/',(req,res)=>{
  res.send('api working')
})

app.listen(port,()=>console.log('sever started port',port))