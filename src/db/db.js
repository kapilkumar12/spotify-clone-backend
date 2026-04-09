const mongoose = require('mongoose')


async function connectDb() {

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MoongoDb connection is succefull")
    } catch (error) {
        console.log("MongoDb connection error:",error)
    }
    
}

module.exports = connectDb