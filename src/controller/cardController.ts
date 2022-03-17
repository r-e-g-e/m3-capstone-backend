import {Request, Response} from "express"
import cardService from "../services/cardService"

class CardController{
  async createCard(req:Request, res:Response){
    const { collectId } = req.params
    const { nome } = req.body

    if(!collectId){
      return res.status(404).json({"error":"collect not found!"})
    }
    
    if(!nome){
      return res.status(400).json({"error":"Missing field: nome."})
    }

    const card = await cardService.createCard(collectId, nome)

    return res.status(201).json(card)
  }

  async getCardsFromCollectId(req:Request, res:Response){
    const { collectId } = req.params

    if(!collectId){
      return res.status(404).json({"error":"collect not found!"})
    }

    const cards = await cardService.getCardsFromCollectId(collectId)

    return res.status(200).json(cards)
  }

  async deleteCard(req:Request,res:Response){
    const { cardId } = req.params

    if(!cardId){
      return res.status(404).json({"error":"card not found!"})
    }

    await cardService.deleteCardById( cardId )

    return res.sendStatus(204)
  }

  async setCardItem(req:Request,res:Response){
    const { cardId } = req.params
    const { meta, isMoney, tipo, currentAmount } = req.body

    if(!cardId){
      return res.status(404).json({"error":"card not found!"})
    }

    const itens = await cardService.setCardItem(cardId, {isMoney, meta, type:tipo, currentAmount})

    return res.status(200).json(itens)
  }
}

export default new CardController()