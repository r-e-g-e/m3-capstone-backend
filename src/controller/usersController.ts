import { Request, Response } from "express"
import UserServices from "../services/userServices"


class UserController {
  async userCreation(req:Request, res:Response){
    const {
      email,
      senha,
      cpf,
      nome
    } = req.body

    if(!email || !senha || !cpf || !nome){
      return res.status(400)
        .json({"error":"The following fileds are required: email, senha, cpf and nome."})
    }

    const createdUser = await UserServices.userCreation({
      cpf,
      name:nome,
      email,
      password: senha
    })

    delete createdUser.password

    return res.status(201).json(createdUser)
  }

  async userSignIn(req:Request, res:Response){
    const {email, senha} = req.body

    if(!email || !senha){
      return res.status(400).json({"error":"Missing email or password"})
    }

    const token = await UserServices.genToken({email, password: senha})

    return res.status(200).json(token)
  }
}

export default new UserController()