const jwt = require('jsonwebtoken')
const Register = require('../models/register')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        const verfiyUser = jwt.verify(token, 'thisisfirstmernappbyabhilash')
        console.log(verfiyUser)
        const user = await Register.findOne({ _id: verfiyUser._id })
        console.log(user.firstname)
        req.token = token
        req.user = user
        next()
    }
    catch (e) {
        res.status(401).send(`NO Acess to this Page! GO Back. The Error is - ${e}`)
    }
}

module.exports = auth