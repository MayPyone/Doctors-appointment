import express from "express"
import { registerUser, userLogin, getProfile, updateProfile } from "../controllers/userController.js"
import authUser from "../middlewares/authUser.js"
import upload from "../middlewares/multer.js"

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login', userLogin)

userRouter.get('/get-profile',authUser, getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser, updateProfile)

export default userRouter