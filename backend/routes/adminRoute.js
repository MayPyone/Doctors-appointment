import express from 'express'
import { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancle, adminDashboard } from '../controllers/adminController.js'
import upload from  '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailabity } from '../controllers/doctorController.js'

const adminRouter = express.Router()
adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.get('/all-doctors',authAdmin, allDoctors)
adminRouter.post('/change-availabity',authAdmin, changeAvailabity)
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancle-appointment',authAdmin,appointmentCancle)
adminRouter.get('/dashboard', authAdmin, adminDashboard)

export default adminRouter