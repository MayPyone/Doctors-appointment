import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const AllAppointments = () => {
  const { aToken, appointments, getAppointments, cancelAppointment } = useContext(AdminContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

  useEffect(()=>{
    getAppointments()
  },[aToken])
  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll '>
      <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-cols py-3 px-6 border-b">

          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p> 
          <p>Doctors</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>
        {
          appointments && appointments.map((item,index)=>(
            <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
              <p>{index+1}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full' src={item.userData.image} alt="user image" /><p>{item.userData.name}</p>
              </div>
              <p>{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full bg-gray-200'  src={item.docData.image}  alt="doctor image"/>
              </div>
              <p>{currency}{item.amount}{console.log(item.cancle)} </p>
              {
                item.cancle ? 
                <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                :item.isCompleted ?
                <p className='text-green-500 text-xs font-medium'>Completed</p>
                :
                <img onClick={()=>{cancelAppointment(item._id)}} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="cancel button"/>
              }

            </div>
          ))
        }
      </div>
    </div>
  )
}

export default AllAppointments