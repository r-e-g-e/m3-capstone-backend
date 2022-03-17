import { prismaClient } from "../prisma/client"
import { Request, Response, NextFunction } from "express"

export const adminRouteMiddleware = async (req:Request, res:Response, next:NextFunction) => {
  const userId = req.userId

  const foundUser = await prismaClient.user.findUnique({where:{id:userId}})

  if(foundUser.role !== "ADMIN"){
    return res.status(401).json({"error":"Unauthorized"})
  }

  next()
}