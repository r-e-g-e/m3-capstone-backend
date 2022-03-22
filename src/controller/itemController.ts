import { Request, Response } from "express"
import itemService from "../services/itemService"

class ItemController{

  async createItem(req:Request,res:Response){
    const { cardId } = req.params
    const { type, isMoney, goal } = req.body

    if(!cardId){
      return res.status(404).json({"error":"card not found!"})
    }

    if(!type || isMoney === undefined || goal === undefined){
      return res.status(400)
        .json({"error":"following fields are required: type, isMoney & goal."})
    }

    const item = await itemService.createItem( cardId, {goal, isMoney, type})

    return res.status(201).json(item)
  }

  async updateItem(req:Request,res:Response){
    const { cardId, itemId } = req.params
    const { currentAmount, goal } = req.body
    
    if(!cardId){
      return res.status(404).json({"error":"card not found!"})
    }

    if(!itemId){
      return res.status(404).json({"error":"item not found!"})
    }

    if(currentAmount === undefined && goal === undefined){
      return res.status(400)
        .json({"error":"one of following fields are required: currentAmount or goal."})
    }

    const item = await itemService.updateItem(cardId, itemId, {currentAmount, goal} )

    return res.status(200).json(item)
  }

  async deleteItem(req:Request,res:Response){
    const { cardId, itemId } = req.params

    if(!cardId){
      return res.status(404).json({"error":"card not found!"})
    }

    if(!itemId){
      return res.status(404).json({"error":"item not found!"})
    }

    await itemService.deleteItem(cardId, itemId)

    return res.sendStatus(204)
  }


}

export default new ItemController()