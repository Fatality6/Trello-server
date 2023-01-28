import Board from "../models/Board.js"
import User from "../models/User.js"
import Column from "../models/Column.js"
import Card from "../models/Card.js"

//Создать доску
export const createBoard = async( req, res ) => {
    try {
        //из req получаем boardName
        const {boardName} = req.body
        //ищем по ID user`а
        const user = await User.findById(req.userId)
            //создаём экземпляр схемы Board
            const newBoard = new Board({
                username: user.username,
                title: boardName,
                author: user._id
            })
            //сохраняем экземпляр в БД
            await newBoard.save()
            //находим автора доски и добавляем в БД в массив boards новую доску
            await User.findByIdAndUpdate(req.userId,{
                $push: { boards: newBoard }
            }) 
            //возвращаем созданный объект
            res.json({newBoard, message: 'Доска создана'})
    } catch (error) {
        res.json({message: 'Что-то пошло не так'})
    }
}

//Найти все доски
export const getAllBoards = async( req, res ) => {
    try {
        //ищем пользователя по ID
        const user = await User.findById(req.userId)
         //составляем массив досок
         const boards = await Promise.all(
            user.boards.map((board) => {
                return Board.findById(board._id)
            })
        )
        //возвращаем массив
        res.json({boards})
    } catch (error) {
        res.json({message: 'Что-то пошло не так'})
    }
}

//Удалить доску
export const removeBoard = async( req, res ) => {
    try {
        // ищем доску по ID и удаляем её
        const board = await Board.findByIdAndDelete(req.params.id)
        //если доски нет возвращаем сообщение
        if(!board) res.json({message: 'Такой доски не существует'})
        //если есть ищем пользователя и удаляем из его досок id доски
        await User.findByIdAndUpdate(req.userId,{
            $pull: { boards: req.params.id}
        })
        //находим все колонки и каточки удаляемой доски и тоже их удаляем
        Promise.all(board.columns.map(async(column) => {
            await Column.findByIdAndDelete(column._id)
            return await Card.deleteMany({ columnId: column._id})
            }
        ))
        //возвращаем сообщение
        res.json({message: 'Доска удалена', id:`${req.params.id}`})
    } catch (error) {
        res.json({message: 'Что-то пошло не так'})
    }
}

//Найти доску по ID
export const getById = async( req, res ) => {
    try {
        // ищем board по ID
        const board = await Board.findById(req.params.id)
        //возвращаем доску
        res.json(board)
    } catch (error) {
        res.json({message: 'Что-то пошло не так'})
    }
}