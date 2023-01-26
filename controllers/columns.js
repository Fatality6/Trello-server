import Board from "../models/Board.js"
import Column from "../models/Column.js"

//Создать column
export const createColumn = async( req, res ) => {
    try {
        //из req получаем boardId, columnName
        const { boardId, columnName } = req.body
        //ищем по ID доску
        const board = await Board.findById(boardId)
            //создаём экземпляр схемы Column
            const newColumn = new Column({
                title: columnName,
                author: board.author
            })
            //сохраняем экземпляр в БД
            await newColumn.save()
            //находим доску колонки и добавляем в БД в массив columns новую колонку
            await Board.findByIdAndUpdate(boardId,{
                $push: { columns: newColumn }
            }) 
            //возвращаем созданный объект в res
            res.json({newColumn, message: 'Колонка создана'})
    } catch (error) {
        res.json({message: 'Что-то пошло не так'})
    }
}

// //Найти все доски
// export const getAllBoards = async( req, res ) => {
//     try {
//         //ищем пользователя по ID
//         const user = await User.findById(req.userId)
//          //составляем массив досок
//          const boards = await Promise.all(
//             user.boards.map((board) => {
//                 return Board.findById(board._id)
//             })
//         )
//         res.json({boards})
//     } catch (error) {
//         res.json({message: 'Что-то пошло не так'})
//     }
// }

// //Удалить доску
// export const removeBoard = async( req, res ) => {
//     try {
//         // ищем доску по ID и удаляем её
//         const post = await Board.findByIdAndDelete(req.params.id)
//         //если поста нет возвращаем сообщение
//         if(!post) res.json({message: 'Такого поста не существует'})
//         //если есть ищем пользователя и удаляем из его постов id поста
//         await User.findByIdAndUpdate(req.userId,{
//             $pull: { boards: req.params.id}
//         })
//         //возвращаем сообщение
//         res.json({message: 'Доска удалена', id:`${req.params.id}`})
//     } catch (error) {
//         res.json({message: 'Что-то пошло не так'})
//     }
// }

// //Найти доску по ID
// export const getById = async( req, res ) => {
//     try {
//         // ищем board по ID
//         const board = await Board.findById(req.params.id)
//         //возвращаем пост
//         res.json(board)
//     } catch (error) {
//         res.json({message: 'Что-то пошло не так'})
//     }
// }