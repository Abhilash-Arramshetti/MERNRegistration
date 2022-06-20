const express = require('express');
const path = require('path')
const app = express()
const hbs = require('hbs')
require('./db/conn')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const Register = require('./models/register');
const port = process.env.PORT || 8000;
const auth = require('./middleware/auth')
//Static path for index.html
const static_path = path.join(__dirname, '../views')
const template_path = path.join(__dirname, '../templates/views')
const partials_path = path.join(__dirname, '../templates/partials')

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(static_path))

app.set('view engine', 'hbs')
app.set('views', template_path)
hbs.registerPartials(partials_path)

app.get('/', (req, res) => {
    res.render('index')
})
app.get('/secret', auth, (req, res) => {
    res.render('secret')
})
app.get('/logout', auth, async (req, res) => {
    try {

        /*logout of single Device */
        // req.user.tokens=req.user.tokens.filter((curr)=>{
        //     return curr.token!=req.token
        // })
        /*Logut of all Devices*/
        req.user.tokens = []
        res.clearCookie('jwt')
        console.log('Logged out Sucessfully')
        await req.user.save()
        res.render('login')
    }
    catch (e) {
        res.status(500).send(e)
    }
})
app.get('/register', (req, res) => {
    res.render('register')
})
app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/register', async (req, res) => {
    try {
        let password = req.body.password
        let cpassword = req.body.confirmpassword
        if (password == cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })
            // console.log('The Sucesspart is'+registerEmployee)

            const token = await registerEmployee.generateAuthToken()
            // console.log('The Token part '+token)

            res.cookie('jwt', token, {
                expires: new Date(Date.now() + 25000),
                httpOnly: true
            })
            console.log(cookie)
            const registered = await registerEmployee.save()
            // console.log('The Page part '+registered)
            res.status(201).render('index')
        }
        else {
            res.send("Password not matching!")
        }
    } catch (e) {
        res.status(400).send(e)
    }
})
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const usermail = await Register.findOne({ email: email })
        const isMatch = await bcrypt.compare(password, usermail.password)
        const token = await usermail.generateAuthToken()
        // console.log('The LogIn Token part '+token)

        //Cookie in Login
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true
            // secure:true
        })
        if (isMatch) {
            res.status(201).render('index')

        }
        else {
            res.send('Invalid email or Password')
        }
    }
    catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})

app.listen(port, () => {
    console.log(`Connected at port ${port}`)
})