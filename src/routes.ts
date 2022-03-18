import { Router } from "express"
import userController from "./controller/usersController"
import collectController from "./controller/collectController"
import cardController from "./controller/cardController"
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

routes.put("/card/:cardId/item", cardController.updateCardItem)

export { routes }