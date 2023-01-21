import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//Register user
export const register = async (req,res) => {
    try {
        // получаем username и password от пользователя
        const { username, password } = req.body

        //ищем совпадения по username в БД
        const isUsed = await User.findOne({username})

        //если находим возвращаем сообщение 'Данный username уже занят'
        if(isUsed) {
            return res.json({
                message:'Данный username уже занят'
            })
        }

        //если не находим, то хешируем пароль где salt это сложность хэша
        const salt = bcrypt.genSaltSync(10)

        //создаём хэш из пароля
        const hash = bcrypt.hashSync(password, salt)

        // создаём новый инстанс схемы User, где вместо пароля используем хэш 
        const newUser = new User({
            username,
            password: hash
        })

        //создаём токен используя jsonwebtoken шифруя id из БД и используя ключ из .env
        //expiresIn:'30d' это время жизненного цикла токена
        const token = jwt.sign(
            {id: newUser._id},
            process.env.JWT_SECRET,
            {expiresIn:'30d'}
        )

        //сохраняем нового пользователя в БД
        await newUser.save()
        //возвращаем пользователю ответ
        res.json({
            token,
            newUser,
            message: 'Регистрация прошла успешно'
        })

    } catch (error) {
        res.json({message:'Ошибка при создании пользователя'})
    }
}

//Login user
export const login = async (req,res) => {
    try {
        // получаем username и password от пользователя
        const { username, password } = req.body

        //ищем совпадения по username в БД
        const user = await User.findOne({username})

        //если совпадений нет, то возвращаем ответ 'Такого пользователя не существует'
        if(!user) {
            res.json({message:'Такого пользователя не существует'})
        }

        //если пользователь найден, то сравниваем пароль и хэш из БД
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        //если совпадения по паролю нет, то возвращаем ответ 'Неверный пароль'
        if(!isPasswordCorrect){
            res.json({message:'Неверный пароль'})
        }

        //если пароль верный, то создаём токен используя jsonwebtoken шифруя id из БД и используя ключ из .env
        //expiresIn:'30d' это время жизненного цикла токена
        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn:'30d'}
        )

        //возвращаем ответ пользователю, в котором есть токен, объект user и сообщение
        res.json({
            token, user, message:'Вы вошли в систему'
        })
        
    } catch (error) {
        res.json({message:'Ошибка авторизации'})
    }
}

