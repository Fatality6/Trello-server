import { Router } from "express"
import { createCard, removeCard, updateCard } from "../controllers/cards.js"
import { checkAuth } from "../utils/chechAuth.js"

//создаём endpointы и при выполнении на них запроса вызываем нужный котроллер или midlware
const router = new Router()

//create card
//api/boards
router.post('/', checkAuth , createCard)

//delete card
//http://localhost:8080/api/cards/:id
router.delete('/:id', checkAuth, removeCard)

//update card
//http://localhost:8080/api/cards/:id
router.put('/:id', checkAuth, updateCard)

export default router