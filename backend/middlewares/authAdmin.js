import jwt from 'jsonwebtoken'

//admin suthentication middleware

const authAdmin = async (req,res,next) => {


    try{
      const {atoken } = req.headers
      if(!atoken){
        return res.json({success:false, message: 'Not Authorized Login again'})
      }
      const token_decode = jwt.verify(atoken,process.env.JWT_SECRET)
       
      if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
        return res.json({success:false, message: 'Not Authorized Login Againnn'})
      }
      next()
    }catch(error){
        res.json({success:false, message: 'invalid credential'})
    }
}

export default authAdmin