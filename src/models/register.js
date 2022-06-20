const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})
//generating token
employeeSchema.methods.generateAuthToken = async function () {
    try {
        // console.log(this._id)
        const token = await jwt.sign({ _id: this._id }, 'thisisfirstmernappbyabhilash')
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token;
    }
    catch (e) {
        res.send('The error part' + e)
        console.log('The Error is ' + e)
    }
}

//password hasing with bcrypt
employeeSchema.pre('save', async function () {
    if (this.isModified('password')) {
        //isModified used for if user changes the password in future after registration
        // console.log(`The Current password is ${this.password}`)
        this.password = await bcrypt.hash(this.password, 10)
        // console.log(`The Current Password is ${this.password}`)
        this.confirmpassword = await bcrypt.hash(this.password, 10)
    }
})
const Register = new mongoose.model('Register', employeeSchema)

module.exports = Register


// const mongoose = require('mongoose')


// mongoose.connect('mongodb://localhost://27017/registeration')
//     .then(() => {
//         console.log('DB is connected at 27017')
//     })
//     .catch((e) => {
//         console.log("DB not Connected - " + e)
//     })



// mongoose.connect('mongodb+srv://Abhilash_Arramshetti:abhilash209@cluster0.efmwb.mongodb.net/Register?retryWrites=true&w=majority')
//     .then(() => {
//         console.log('DB is connected at 27017')
//     })
//     .catch((e) => {
//         console.log("DB not Connected - " + e)
//     })


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://Abhilash_Arramshetti:abhilash209@cluster0.efmwb.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// client.connect((err, db) => {
//     if (err) {
//         const collection = client.db("Register").collection("register");
//         // perform actions on the collection object
//         client.close();
//     }  
//     else {
//         console.log(db)
//     }
// });
