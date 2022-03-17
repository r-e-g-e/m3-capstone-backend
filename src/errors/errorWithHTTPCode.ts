export default class ErrorHTTP extends Error{
  constructor(message:string, httpCode = 400){
    super(message)
    this.httpCode = httpCode
  }
  httpCode:number
}
