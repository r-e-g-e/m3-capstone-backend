import ErrorHTTP from "../errors/errorWithHTTPCode"
import { prismaClient } from "../prisma/client"

interface ICardItemDataCreate{
  goal: number
  isMoney: boolean
  type: string
}

interface ICardItemDataUpdate{
  name?: string
  goal?: number
  currentAmount?: number
}

class CardService{
  async createCard(collectId:string, cardName:string, itemData:ICardItemDataCreate){
    const collect = await prismaClient.collect.findUnique({where:{id: collectId}})

    if(!collect){
      throw new ErrorHTTP("collect not found", 404)
    }

    const card = await prismaClient.card.create({
      data:{
        collectId: collect.id,
        name:cardName,
        item: JSON.stringify({
          ...itemData,
          currentAmount: 0
        })
      }
    })

    card.item = JSON.parse(card.item)

    return card
  }

  async getCardsFromCollectId(collectId:string){

    const [cards, doCollectExists] = await Promise.all([
      prismaClient.card.findMany({where:{collectId}}),
      prismaClient.collect.findUnique({where:{id: collectId}})
    ])

    if(!doCollectExists) throw new ErrorHTTP("collect not found", 404)

    return cards.map( card =>{
      card.item = JSON.parse(card.item)

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

  async updateCardItem(id:string, name = "", itemData:ICardItemDataUpdate){
    const card = await prismaClient.card.findUnique({where:{id}})

    if(!card) throw new ErrorHTTP("card not found!", 404)

    if(name) card.name = name

    const parsedItem = JSON.parse(card.item)

    for(const [key, value] of Object.entries(itemData)){
      if(value) {
        if(key === "currentAmount" && value > parsedItem.goal){
          parsedItem[key] = parsedItem.goal
        }
        else{
          parsedItem[key] = value
        }
      }
    }

    card.item = JSON.stringify(parsedItem)

    await prismaClient.card.update({
      where:{id},
      data:card
    })

    return {
      ...card,
      item: parsedItem
    }
  }
}

export default new CardService()