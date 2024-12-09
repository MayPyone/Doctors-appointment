import validator from "validator"
import bcrypt from "bcrypt"
import userModel from "../models/userModel.js"
import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js"
import jwt from "jsonwebtoken"
import {v2 as cloudinary} from "cloudinary"
import razorpay from "razorpay"
const registerUser = async (req, res) => {
    console.log(req.body)
    try {
        const { name, email, password } = req.body
        console.log(name, email, password)
        if (!name || !email || !password) {
            res.json({ success: false, message: 'Missing deails' })
        }
        if (!validator.isEmail(email)) {
            res.json({ success: false, message: 'enter a valid email' })
        }

        if (password.length < 8) {
            res.json({ success: false, message: 'enter a strong password' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })

        if (!user) {
            res.json({ success: false, message: "The user can't be found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credential" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getProfile = async (req, res) => {
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')
        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !address || !dob || !gender){
            return res.json({success: false, message: "Data Missing"})
        }

        await userModel.findByIdAndUpdate(userId,{name, phone, address: JSON.parse(address), dob, gender})
        if(imageFile){
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type: 'image'})
            const imageUrl = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, {image: imageUrl})
        }

        res.json({success:true, message:"Profile updated"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const bookAppointment = async (req, res) => {
    try{
        const {userId, docId, slotDate, slotTime} = req.body
        if (!userId || !docId || !slotDate || !slotTime) {
            return res.status(400).json({ success: false, message: 'All fields are required: userId, docId, slotDate, slotTime.' });
        }
        const docData = await doctorModel.findById(docId).select('-password')
        if(!docData.available){
            return res.json({success: false, message: 'Doctor is not available'})
        }

        let slots_booked = docData.slots_booked
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return   res.json({success: false, message: 'Slot is not available'})
            }else{
                slots_booked[slotDate].push(slotTime)
            }
        }else{
            slots_booked[slotDate]= []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')
        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }
        const newAppointment = new appointmentModel(appointmentData)
        newAppointment.save()

        //save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        return  res.json({success:true, message:"Appointment Booked"})

    }catch(error){
        console.log(error)
        return  res.json({success: false, message: error.message})
    }

}

const listAppointment = async (req,res) => {
    try {
       const {userId} = req.body
       const appointments = await appointmentModel.find({userId})
       return  res.json({success:true, appointments})

    }catch(error){
        console.log(error)
        return  res.json({success: false, message: error.message})
    }
}

const cancleAppointment = async (req,res) => {
    try{
        const {userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData.userId !== userId) {
            return res.json({success: false, message: "Unauthorize action!"})
        }

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancle: true})

        const {docId, slotDate, slotTime} = appointmentData
        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e=> e!== slotTime)
        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success: true, message: "Appointment Cancelled"})

    }catch(error){
        console.log(error)
        return  res.json({success: false, message: error.message})
    }
}

const payment = async(req,res ) => {
    try {
        const { appointmentId } = req.body;

        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

    
        appointment.payment = true;

       
        await appointment.save();

        return res.status(200).json({ success: true, message: "Payment Successful" });
    } catch (error) {
        console.log(error)
        return  res.json({success: false, message: error.message})
    }
} 

export { registerUser, userLogin, getProfile, updateProfile, bookAppointment, listAppointment, cancleAppointment, payment }