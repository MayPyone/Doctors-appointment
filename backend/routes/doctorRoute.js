import express from 'express'
import {
    doctorList, doctorLogin, appointmentsDoctor, appointmentCancel, appointmentComplete, doctorDashboard,
    doctorProfile, UpdateDoctorProfile
} from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'
const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', doctorLogin)
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor)
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel)
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete)
doctorRouter.get('/dashboard', authDoctor, doctorDashboard)
doctorRouter.post('/update-profile', authDoctor, UpdateDoctorProfile)
doctorRouter.get('/profile', authDoctor, doctorProfile)


export default doctorRouter