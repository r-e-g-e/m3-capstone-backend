import { Request, Response, NextFunction} from "express"
import ErrorHTTP from "../errors/errorWithHTTPCode"

export function handleAsyncErrors(error:Error, req:Request, res: Response, next:NextFunction) {
  if (error instanceof ErrorHTTP){
    return res.status(error.httpCode).json({"error": error.message})
  }

  console.log(error)
    
  return res.status(500).json({"error": "Internal server error"})
}
