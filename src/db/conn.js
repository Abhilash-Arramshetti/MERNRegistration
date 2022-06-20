const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/registration', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('DB is connected at 27017')
    })
    .catch((e) => {
        console.log("DB not Connected - " + e)
    })