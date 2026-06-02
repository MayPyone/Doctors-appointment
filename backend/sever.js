import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'


//app conig
const app = express()
const port = process.env.PORT || 3000

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

//apiendpoints
app.get('/',(req,res)=>{
  res.send('api working')
})

const startServer = async () => {
  try {
    await Promise.race([
      connectDB(),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('MongoDB connection timed out after 10 seconds')), 10000)
      })
    ])
    connectCloudinary()
    app.listen(port,()=>console.log('server started port',port))
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer()
