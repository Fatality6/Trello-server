import { Router } from "express"
import { createColumn } from "../controllers/columns.js"
import { checkAuth } from "../utils/chechAuth.js"

//создаём endpointы и при выполнении на них запроса вызываем нужный котроллер или midlware
const router = new Router()

//create board
//api/boards
router.post('/', checkAuth , createColumn)

// //get boards
// router.get('/', checkAuth, getAllBoards)

// //delete board
// //http://localhost:8080/api/boards/:id
// router.delete('/:id', checkAuth, removeBoard)

// //Найти Доску по ID
// //http://localhost:8080/api/boards/:id
// router.get('/:id', getById)

export default router