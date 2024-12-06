import express from "express"
import { registerUser, userLogin, getProfile, updateProfile, bookAppointment, listAppointment, cancleAppointment } from "../controllers/userController.js"
import authUser from "../middlewares/authUser.js"
import upload from "../middlewares/multer.js"

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login', userLogin)

userRouter.get('/get-profile',authUser, getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser, updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment', authUser, cancleAppointment)



export default userRouter
