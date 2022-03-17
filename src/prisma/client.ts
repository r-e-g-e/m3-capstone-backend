import { PrismaClient } from "@prisma/client"

const prismaClient = new PrismaClient()

prismaClient.$connect().then( () => console.log("Connected to DB!"))

export {prismaClient}