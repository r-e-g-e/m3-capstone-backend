import { IItem } from "../@types/cards"
import ErrorHTTP from "../errors/errorWithHTTPCode"
import { prismaClient } from "../prisma/client"

interface ICreateCollect{
  name: string
  state: string
  capital: string
  link: string
}

interface IGetPagination{
  perPage: number
  page: number
}

class CollectService{
  async createCollect({name, state, capital, link}:ICreateCollect){
    const collect = await prismaClient.collect.create({
      data:{
        mapsLink:link,
        name,
        state,
        capital
      }
    })

    return collect
  }

  async getCollectById(id:string){
    const collect = await prismaClient.collect.findUnique({where:{id}})
    
    if(!collect) throw new ErrorHTTP("collect not found", 404)

    return collect
  }

  async deleteCollectById(id:string){
    await prismaClient.collect.delete({where:{id}})
      .catch( () => {
        throw new ErrorHTTP("collect not found", 404)
      })

    return
  }

  async getCollectsPagination({perPage, page}:IGetPagination){
    const count = await prismaClient.collect.count()
    const collects = await prismaClient.collect.findMany({
      skip: perPage * page,
      take: perPage
    })

    const promises = collects.map( async (collect) => {
      const cardItensArray = await prismaClient.card.findMany({
        where:{
          collectId:collect.id
        },
        select:{
          id:false,
          itens:true,
          name:false,
          collect:false,
          collectId:false,
        }
      })

      const result = {
        current:0,
        goal:0
      }

      cardItensArray.forEach( ({itens}) => {
        const parsedItens = JSON.parse(itens) as Array<IItem>
  
        result.goal += parsedItens.reduce( (acc, item) => item.goal + acc, 0)
        result.current += parsedItens.reduce( (acc, item) => item.currentAmount + acc, 0)
      }) 

      return result
    })
    
    
    const currentAndGoals = await Promise.all(promises)
    const goal = currentAndGoals.reduce( (acc, item) => item.goal + acc, 0)
    const current = currentAndGoals.reduce( (acc, item) => item.current + acc, 0)
    const percentage = ((current * 100) / goal).toFixed(2)


    const totalPages = Math.floor(count / perPage)

    return {
      collects,
      percentage,
      totalPages,
      currentPage: page
    }
  }

}

export default new CollectService()