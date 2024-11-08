const changeAvailabity = async(req,res)=>{
  try{

  }catch(error){
     console.log(error)
     res.json({success:false, message:error})
  }
}

export {changeAvailabity}