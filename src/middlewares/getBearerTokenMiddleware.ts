import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"

export const getBearerTokenMiddleware = (req:Request, res:Response, next:NextFunction) => {
  let token = req.headers.authorization
    
  if(!token){
    return res.status(401).json({error:"Unauthorized"})
  }
    
  
  try {
    token = token.replace("Bearer ", "")

    const decoded = verify(token, process.env.JWT_SECRET)
        
    req.userId = decoded.sub as string
        
  } catch (error) {
    return res.status(401).json({error:"Unauthorized"})
  }

  return next()
}