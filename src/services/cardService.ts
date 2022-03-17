import ErrorHTTP from "../errors/errorWithHTTPCode"
import { prismaClient } from "../prisma/client"

interface ISetCardItem{
  meta: number
  currentAmount?: number
  isMoney: boolean
  type: string
}

class CardService{
  async createCard(collectId:string, cardName:string){
    const collect = await prismaClient.collect.findUnique({where:{id: collectId}})

    if(!collect){
      throw new ErrorHTTP("collect not found", 404)
    }

    const card = await prismaClient.card.create({
      data:{
        collectId: collect.id,
        name:cardName
      }
    })

    return card
  }

  async getCardsFromCollectId(collectId:string){
    const cards = await prismaClient.card.findMany({where:{collectId}})
    return cards.map( card =>{
      if(card.itens){
        card.itens = JSON.parse(card.itens)
      }

      return card
    })
  }

  async deleteCardById(id:string){
    await prismaClient.card.delete({where:{id}})
      .catch( () => {
        throw new ErrorHTTP("card not found", 404)
      })

    return
  }

  async setCardItem(id:string, itemData:ISetCardItem){
    const card = await prismaClient.card.findUnique({where:{id}})

    card.itens = JSON.stringify({...itemData})
    
    await prismaClient.card.update({
      where:{id},
      data: card
    })

    return itemData
  }
}

export default new CardService()