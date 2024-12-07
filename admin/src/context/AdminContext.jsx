import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState()
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { 'atoken': aToken } })
      if (data.success) {
        setDoctors(data.doctors)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeAvailabity = async (docId) => {
    console.log(docId)
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/change-availabity', { docId }, { headers: { aToken } })
      console.log(data)
      if (data.success) {
        toast.success(data.message)
        getAllDoctors()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }

  }

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/appointments", { headers: { aToken } })
      if (data.success) {
        setAppointments(data.appointments)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/admin/cancle-appointment", { appointmentId }, { headers: { aToken } })
      if (data.success) {
        toast.success(data.message)
        getAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }

  }

  const value = {
    aToken, setAToken,
    backendUrl,
    doctors, getAllDoctors, changeAvailabity,
    appointments, setAppointments, getAppointments, cancelAppointment
  }

  return (
    <AdminContext.Provider value={value}>
      {
        props.children
      }
    </AdminContext.Provider>
  )
}

export default AdminContextProvider