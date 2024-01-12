const { mongoose } = require("mongoose");

const MONGO_URI = process.env.MONGO_URL
const databaseConnect = () => {
    mongoose.connect(MONGO_URI)
    .then((conn) => console.log(`Database Connected to : ${conn.connection.host}`))
    .catch((err) => console.log(`Error Occured during Db connection : ${err.message}`))
}

module.exports = databaseConnect;