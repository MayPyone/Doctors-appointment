import mongoose from "mongoose";

const connectDB = async() => {
  mongoose.connection.on('connected',()=>console.log('DB connected'))

  if (!process.env.DB) {
    throw new Error('DB environment variable is missing')
  }

  await mongoose.connect(process.env.DB, {
    serverSelectionTimeoutMS: 10000
  })
}

export default connectDB
