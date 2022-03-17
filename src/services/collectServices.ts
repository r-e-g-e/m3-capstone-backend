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

    const totalPages = Math.floor(count / perPage)

    return {
      collects,
      totalPages
    }
  }

}

export default new CollectService()