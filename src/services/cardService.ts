import ErrorHTTP from "../errors/errorWithHTTPCode"
import { prismaClient } from "../prisma/client"
import { IItem } from "../@types/cards"

class CardService{
  async createCard(collectId:string, cardName:string){
    const collect = await prismaClient.collect.findUnique({where:{id: collectId}})

    if(!collect) throw new ErrorHTTP("collect not found", 404)

    const card = await prismaClient.card.create({
      data:{
        collectId: collect.id,
        name:cardName,
        itens: JSON.stringify([])
      }
    })

    card.itens = JSON.parse(card.itens)

    return card
  }

  async getCardsFromCollectId(collectId:string){
    // function calcPergentage(total, current){

    // }

    const [cards, doCollectExists] = await Promise.all([
      prismaClient.card.findMany({where:{collectId}}),
      prismaClient.collect.findUnique({where:{id: collectId}})
    ])

    if(!doCollectExists) throw new ErrorHTTP("collect not found", 404)


    return cards.map( card =>{
      const parsedItens = JSON.parse(card.itens) as Array<IItem>

      const goal = parsedItens.reduce( (acc, item) => item.goal + acc, 0)
      const current = parsedItens.reduce( (acc, item) => item.currentAmount + acc, 0)

      console.log(goal, current)

      const percentage = ((current * 100) / goal).toFixed(2)

      delete card.itens

      return {
        ...card,
        percentage
      }
    })
  }

  async deleteCardById(id:string){
    await prismaClient.card.delete({where:{id}})
      .catch( () => {
        throw new ErrorHTTP("card not found", 404)
      })

    return
  }

}

export default new CardService()