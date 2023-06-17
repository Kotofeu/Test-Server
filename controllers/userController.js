const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const staticManagement = require('../helpers/staticManagement')
const validationManagement = require('../helpers/validationManagement')

const {
    User, UserAuthorization
} = require('../modules/models');
const generateJwt = (id, email, role, image = '') => {
    return jwt.sign(
        { id, email, role, image },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )
}

class userController {
    async registration(req, res, next) {
        try {
            const { email, password } = req.body
            if (!validationManagement.isEmailValid(email)) {
                return next(ApiError.badRequest('Некорректный email'))
            }
            if (!validationManagement.isPasswordValid(password)) {
                return next(ApiError.badRequest("Пароль должен иметь минимум одну заглавную " +
                    "и строчную букву, одно число и состоять от 6 до 20 символов"))
            }
            const candidate = await UserAuthorization.findOne({ where: { email } })
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({ name: email })
            const userAuth = await UserAuthorization.create({ email, password: hashPassword, userId: user.id })
            const token = generateJwt(user.id, userAuth.email, userAuth.role)
            return res.json({ token })
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userAuthorization = await UserAuthorization.findOne({ where: { email } })
            if (!userAuthorization) {
                return next(ApiError.internal('Пользователь не найден'))
            }
            let comparePassword = bcrypt.compareSync(password, userAuthorization.password)
            if (!comparePassword) {
                return next(ApiError.internal('Указан неверный пароль'))
            }
            const user = await User.findOne({ where: { id: userAuthorization.userId } })
            const token = generateJwt(user.id, userAuthorization.email, userAuthorization.role, user.image)
            return res.json({ token })
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async createAdmin(req, res, next) {
        try {
            const { email, password } = req.body
            if (!validationManagement.isEmailValid(email)) {
                return next(ApiError.badRequest('Некорректный email'))
            }
            if (!validationManagement.isPasswordValid(password)) {
                return next(ApiError.badRequest("Пароль должен иметь минимум одну заглавную " +
                "и строчную букву, одно число и состоять от 6 до 20 символов"))
            }

            const candidate = await UserAuthorization.findOne({ where: { email } })
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({ name: email })
            const userAuth = await UserAuthorization.create({ email, role: "ADMIN", password: hashPassword, userId: user.id })
            return res.json(userAuth)
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async edit(req, res, next) {
        try {
            const {
                name,
                newEmail,
                newPassword,
                phone,
                isSubscribed,
            } = req.body;
            const user = await UserAuthorization.findOne({ where: { userId: req.user.id } })
            if (!user) {
                return next(ApiError.internal('Пользователь не найден'))
            }
            if (!validationManagement.isEmailValid(newEmail) && newEmail) {
                return next(ApiError.badRequest('Некорректный email'))
            }
            if (!validationManagement.isPasswordValid(newPassword) && newPassword) {
                return next(ApiError.badRequest("Пароль должен иметь минимум одну заглавную " +
                    "и строчную букву, одно чило и сотоять от 6 до 20 символов"))
            }
            if (newEmail){
                const candidate = await UserAuthorization.findOne({ where: { email: newEmail } })
                if (candidate) {
                    return next(ApiError.badRequest('Пользователь с таким email уже существует'))
                }
            }
            if (phone){
                const candidate = await User.findOne({ where: { phone: phone } })
                if (candidate) {
                    return next(ApiError.badRequest('Пользователь с таким телефоном уже существует'))
                }
            }
            let image;
            let fileName
            let hashPassword
            if (req.files && req.files.image) {
                image = req.files.image
                fileName = staticManagement.staticCreate(image)
                staticManagement.staticDelete(await User.findOne({ where: { id: req.user.id } }))
            }

            if (newPassword) {
                hashPassword = await bcrypt.hash(newPassword, 5)
            }

            const updatedUser = await User.update({
                name, phone, isSubscribed, image: fileName
            }, { where: { id: user.userId } })
            const userAuthorization = await UserAuthorization.update({
                email: newEmail, password: hashPassword
            }, { where: { id: user.id } })

            const newAuth = await UserAuthorization.findOne({ where: { userId: req.user.id } })
            const newUser = await User.findOne({ where: { id: user.userId } })

            const token = generateJwt(req.user.id, newAuth.email, newUser.role, newUser.image)
            return res.json({ token })
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.image)
        return res.json({ token })
    }
    async getById(req, res, next) {
        try {
            const { id } = req.params
            const user = await User.findOne(
                {
                    where: { id },
                    include: { model: UserAuthorization, attributes: ["role", "email"] }

                },
            )
            return res.json(user)
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new userController()