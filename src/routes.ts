import { Router } from "express"
import userController from "./controller/usersController"
import collectController from "./controller/collectController"
import cardController from "./controller/cardController"
import itemController from "./controller/itemController"
// import { adminRouteMiddleware } from "./middlewares/adminRouteMiddleware"
// import { getBearerTokenMiddleware } from "./middlewares/getBearerTokenMiddleware"

const routes = Router()

routes.post("/users/signup", userController.userCreation)
routes.post("/users/signin", userController.userSignIn)


routes.post("/collect", collectController.createCollect)
routes.get("/collect/:collectId", collectController.getCollectById)
routes.get("/collect", collectController.getCollectPagination)
routes.delete("/collect/:collectId", collectController.deleteCollect)

routes.post("/collect/:collectId/card", cardController.createCard)
routes.get("/collect/:collectId/card", cardController.getCardsFromCollectId)
routes.delete("/card/:cardId", cardController.deleteCard)

routes.get("/card/:cardId/item", itemController.getItens)
routes.post("/card/:cardId/item", itemController.createItem)
routes.put("/card/:cardId/item/:itemId", itemController.updateItem)
routes.delete("/card/:cardId/item/:itemId", itemController.deleteItem)

export { routes }