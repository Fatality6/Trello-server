import Board from "../models/Board.js"
import Card from "../models/Card.js"
import Column from "../models/Column.js"

//Создать карточку
export const createCard = async( req, res ) => {
    try {
        //из req получаем id, cardName
        const { id, cardName } = req.body
        //ищем по ID колонку
        const column = await Column.findById(id)
            //создаём экземпляр схемы Card
            const newCard = new Card({
                title: cardName,
                author: column.author,
                columnId: id
            })
            //сохраняем экземпляр в БД
            await newCard.save()
            //находим колонку новой карточки и добавляем в БД в массив cards новую карточку
            await Column.findByIdAndUpdate(id,{
                $push: { cards: newCard }
            }) 
            //возвращаем созданный объект
            res.json({newCard, message: 'Колонка создана'})
    } catch (error) {
        res.json({message: 'Что-то пошло не так'})
    }
}

//Найти все карточки
export const getAllCards = async( req, res ) => {
    try {
        const {id} = req.query
        //ищем доску по ID
        const column = await Column.findById(id)
         //составляем массив колонок
        const cards = await Promise.all(
            column.cards.map((card) => {
                return Card.findById(card._id)
            })
        )
        //возвращаем массив
        res.json({cards})
    } catch (error) {
        res.json({message: 'Что-то пошло не так'})
    }
}

//Удалить карточку
export const removeCard = async( req, res ) => {
    try {
        // ищем карточку по ID и удаляем её
        const card = await Card.findByIdAndDelete(req.params.id)
        //если карточки нет возвращаем сообщение
        if(!card) res.json({message: 'Такой карточки не существует'})
        //если есть ищем колонку и удаляем из ее карточек id карточки
        await Column.findByIdAndUpdate(card.columnId,{
            $pull: { cards: req.params.id}
        })
        //возвращаем сообщение и id удалённой колонки
        res.json({message: 'карточка удалена', id:`${req.params.id}`})
    } catch (error) {
        res.json({message: 'Что-то пошло не так'})
    }
}