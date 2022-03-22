import { IItem } from "../@types/cards"
import ErrorHTTP from "../errors/errorWithHTTPCode"
import { prismaClient } from "../prisma/client"
import { v4 as uuid } from "uuid"

interface ICreateItem{
  goal: number
  type: string
  isMoney: boolean
}

interface ICardItemDataUpdate{
  goal?: number
  currentAmount?: number
}

class ItemService{

  async createItem(CardId: string, {goal, isMoney, type}:ICreateItem){
    const card = await prismaClient.card.findUnique({where:{id:CardId}})
    
    if(!card) throw new ErrorHTTP("card not found", 404)

    const parsedItens = JSON.parse(card.itens) as Array<IItem>

    const newItem:IItem = {
      id: uuid(),
      goal,
      type,
      isMoney,
      currentAmount:0
    }

    parsedItens.push(newItem)

    card.itens = JSON.stringify(parsedItens)

    await prismaClient.card.update({
      where:{id: CardId},
      data: card
    })

    return newItem
  }
  
  async updateItem(cardId:string, itemId: string, itemData:ICardItemDataUpdate){
    const card = await prismaClient.card.findUnique({where:{id: cardId}})

    if(!card) throw new ErrorHTTP("card not found!", 404)

    const parsedItem = JSON.parse(card.itens) as Array<IItem>
    const itemIndex = parsedItem.findIndex( ({id}) => id === itemId)

    if(itemIndex === -1) throw new ErrorHTTP("item not found", 404)
    
    Object.entries(itemData).forEach( ([key, value]) => {
      if(value !== undefined) {
        if(key === "currentAmount" && value > parsedItem[itemIndex].goal){
          parsedItem[itemIndex][key] = parsedItem[itemIndex].goal
        }
        else{
          parsedItem[itemIndex][key] = value
        }
      }
    })

    card.itens = JSON.stringify(parsedItem)

    await prismaClient.card.update({
      where:{id: cardId},
      data:card
    })

    return parsedItem[itemIndex]
  }

  async deleteItem(cardId:string, itemId: string){
    const card = await prismaClient.card.findUnique({where:{id:cardId}})
    if(!card) throw new ErrorHTTP("card not found!", 404)

    const parsedItens = JSON.parse(card.itens) as Array<IItem>
    const indexToRemove = parsedItens.findIndex(({id}) => id === itemId)

    if(indexToRemove === -1) throw new ErrorHTTP("item not found", 404)

    parsedItens.splice(indexToRemove, 1)
    card.itens = JSON.stringify(parsedItens)

    await prismaClient.card.update({
      where:{id:cardId},
      data: card
    })

    return true
  }
} 

export default new ItemService()