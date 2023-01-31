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
            res.json({newCard, id, message: 'Колонка создана'})
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
        res.json({message: 'карточка удалена', cardId:`${req.params.id}`, columnId:`${card.columnId}`})
    } catch (error) {
        res.json({message: 'Что-то пошло не так'})
    }
}