import jwt from 'jsonwebtoken'

//admin suthentication middleware

const authUser = async (req,res,next) => {


    try{
      const {token } = req.headers
      console.log(token)
      
      if(!token){
        return res.json({success:false, message: 'Not Authorized Login again'})
      }
      const token_decode = jwt.verify(token,process.env.JWT_SECRET)
       
     req.body.userId = token_decode.id
      next()
    }catch(error){
        res.json({success:false, message: 'invalid credential'})
    }
}

export default authUser   