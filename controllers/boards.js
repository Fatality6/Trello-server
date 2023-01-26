import Board from "../models/Board.js"
import User from "../models/User.js"

//Создать доску
export const createBoard = async( req, res ) => {
    try {
        //из req получаем boardName
        const {boardName} = req.body
        //ищем по ID user`а
        const user = await User.findById(req.userId)
            //создаём экземпляр схемы Post
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
            //возвращаем созданный объект в res
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
        res.json({boards})
    } catch (error) {
        res.json({message: 'Что-то пошло не так'})
    }
}

//Удалить доску
export const removeBoard = async( req, res ) => {
    try {
        // ищем доску по ID и удаляем её
        const post = await Board.findByIdAndDelete(req.params.id)
        //если поста нет возвращаем сообщение
        if(!post) res.json({message: 'Такого поста не существует'})
        //если есть ищем пользователя и удаляем из его постов id поста
        await User.findByIdAndUpdate(req.userId,{
            $pull: { boards: req.params.id}
        })
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
        //возвращаем пост
        res.json(board)
    } catch (error) {
        res.json({message: 'Что-то пошло не так'})
    }
}