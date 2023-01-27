import { Router } from "express"
import { createColumn, getAllColumns, removeColumn } from "../controllers/columns.js"
import { checkAuth } from "../utils/chechAuth.js"

//создаём endpointы и при выполнении на них запроса вызываем нужный котроллер или midlware
const router = new Router()

//create column
//api/boards
router.post('/', checkAuth , createColumn)

//get columns
router.get('/', checkAuth, getAllColumns)

//delete column
//http://localhost:8080/api/columns/:id
router.delete('/:id', checkAuth, removeColumn)

export default router