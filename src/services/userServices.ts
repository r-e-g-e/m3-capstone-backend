import { prismaClient } from "../prisma/client"
import { hash, compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import ErrorHTTP from "../errors/errorWithHTTPCode"
// import { user } from ".prisma/client"

interface IUserCreation{
  cpf: string
  name: string
  email: string
  password: string
}

interface IUserLogIn{
  email: string
  password: string
}

class UserServices {
  public async userCreation({ email, password, name, cpf  }:IUserCreation){

    const userAlreadyExist = await prismaClient.user.findUnique({where:{email}})
    if(userAlreadyExist) throw new ErrorHTTP("Email already in use!")

    const hashedPassword = await hash(password, 8)
    const createdUser = await prismaClient.user.create({
      data:{
        email,
        cpf,
        name,
        password: hashedPassword
      }
    })

    return createdUser
  }

  public async genToken({email, password}:IUserLogIn){
    const currentUser = await prismaClient.user.findUnique({where:{email}})

    if(!currentUser){
      throw new ErrorHTTP("Wrong email or password!", 400)
    }

    const isPasswordValid = await compare(password, currentUser.password)

    if(!isPasswordValid){
      throw new ErrorHTTP("Wrong email or password!", 400)
    }

    const token = sign({email}, process.env.JWT_SECRET, {subject:currentUser.id, expiresIn:"7d"})

    return token
  }
}

export default new UserServices()