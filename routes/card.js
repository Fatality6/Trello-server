import { Router } from "express"
import { createCard, removeCard } from "../controllers/cards.js"
import { checkAuth } from "../utils/chechAuth.js"

//создаём endpointы и при выполнении на них запроса вызываем нужный котроллер или midlware
const router = new Router()

//create column
//api/boards
router.post('/', checkAuth , createCard)

//delete column
//http://localhost:8080/api/cards/:id
router.delete('/:id', checkAuth, removeCard)

export default router