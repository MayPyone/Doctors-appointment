import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import{toast} from 'react-toastify'
export const AppContext = createContext()


const AppContextProvider = (props) => {
  const currencySymbol = '$'
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [doctors, setDoctors] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'): false)
  const [userData, setUserData] = useState(false)
 
  const getDoctorsData = async () => {
    try{
      const {data} = await axios.get(backendUrl+'/api/doctor/list')
      if(data.success){
        setDoctors(data.doctors)
      }
    }catch(error){
       console.log(error)
    }
  }

  const loadUserProfileData = async ()=>{
    try{
      const {data} = await axios.get(backendUrl+'/api/user/get-profile',{headers:{token}})
      if(data.success){
        setUserData(data.userData)
      }else{
        toast.error(data.message)
      }

    }catch(error){
      console.log(error)
    }
  }

  const value = {
    doctors, currencySymbol,
    token, setToken, backendUrl,
    userData, setUserData, loadUserProfileData,
    getDoctorsData
  }

  useEffect(()=>{
    getDoctorsData()
  },[])

  useEffect(()=>{
    if(token){
      loadUserProfileData()
    }
  },[token])

  return(
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider;