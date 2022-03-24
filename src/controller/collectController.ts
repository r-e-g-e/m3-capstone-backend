import { Request, Response } from "express"
import collectServices from "../services/collectServices"

class CollectController{
  async createCollect(req:Request,res:Response){
    const {
      nome,
      estado,
      capital,
      link
    } = req.body

    if(!nome || !estado || !capital || !link){
      return res.status(400).json({"error":"The following fields are required: nome, estado, capital, link"})
    }

    const collect = await collectServices.createCollect({
      state:estado,
      name:nome,
      capital,
      link
    })

    return res.status(200).json(collect)
  }

  async getCollectById(req:Request,res:Response){
    const { collectId } = req.params
    
    if(!collectId){
      return res.status(404).json({"error":"collect not found!"})
    }

    const collect = await collectServices.getCollectById(collectId)

    return res.status(200).json(collect)
  }

  async getCollectPagination(req:Request,res:Response){
    const { perPage, page } = req.query
    const { filter } = req.body

    let perPageNumber = Number(perPage)
    let pageNumber = Number(page)

    if(isNaN(perPageNumber) || perPageNumber <= 0) perPageNumber = 5
    if(isNaN(pageNumber) || pageNumber < 0) pageNumber = 0

    const collects = await collectServices.getCollectsPagination({perPage:perPageNumber, page:pageNumber}, filter)

    return res.status(200).json(collects)
  }

  async deleteCollect(req:Request,res:Response){
    const { collectId } = req.params
    
    if(!collectId){
      return res.status(404).json({"error":"collect not found!"})
    }

    await collectServices.deleteCollectById(collectId)

    return res.sendStatus(204)
  }
}

export default new CollectController()