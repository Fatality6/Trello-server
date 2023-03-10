import Board from "../models/Board.js"
import Card from "../models/Card.js"
import Column from "../models/Column.js"

//Создать колонку
export const createColumn = async( req, res ) => {
    try {
        //из req получаем boardId, columnName
        const { boardId, columnName } = req.body
        //ищем по ID доску
        const board = await Board.findById(boardId)
            //создаём экземпляр схемы Column
            const newColumn = new Column({
                title: columnName,
                author: board.author,
                boardId: boardId
            })
            //сохраняем экземпляр в БД
            await newColumn.save()
            //находим доску новой колонки и добавляем в БД в массив columns новую колонку
            await Board.findByIdAndUpdate(boardId,{
                $push: { columns: newColumn }
            }) 
            //возвращаем созданный объект
            res.json({newColumn, message: 'Колонка создана'})
    } catch (error) {
        res.json({message: 'Что-то пошло не так'})
    }
}

//Найти все колонки
export const getAllColumns = async (req, res) => {
    try {
      const { boardId } = req.query;
      //ищем доску по ID
      const board = await Board.findById(boardId)
      //составляем массив колонок
      const columns = await Promise.all(
        //ищем колонки и карточки
        board.columns.map(async (column) => {
          const col = await Column.findById(column._id)
          const cards = await Promise.all(
            col.cards.map(async (card) => {
              return await Card.findById(card._id)
            })
          )
          //объединяем данные с помощью деструктурризации
          return { ...col._doc, cards }
        })
      )
      //возвращаем массив объектов
      res.json({ columns })
    } catch (error) {
      res.json({ message: "Что-то пошло не так" });
    }
  };

//Удалить колонку
export const removeColumn = async( req, res ) => {
    try {
        // ищем колонку по ID и удаляем её
        const column = await Column.findByIdAndDelete(req.params.id)
        //если колонки нет возвращаем сообщение
        if(!column) res.json({message: 'Такой колонки не существует'})
        //если есть ищем доску и удаляем из ее колонок id колонки
        await Board.findByIdAndUpdate(column.boardId,{
            $pull: { columns: req.params.id}
        })
        //находим все карточки удаляемой колонки и тоже их удаляем
        column.cards.map(async(card) => {
            return await Card.findByIdAndDelete(card._id)
            }
        )
        //возвращаем сообщение и id удалённой колонки
        res.json({message: 'Колонка удалена', id:`${req.params.id}`})
    } catch (error) {
        res.json({message: 'Что-то пошло не так'})
    }
}