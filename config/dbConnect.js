require('dotenv').config()
const mongoose = require('mongoose');

module.exports = class DB{
    static connect(){
        return mongoose.connect(process.env.DB_HOST,{
            promiseLibrary: global.Promise,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    };
};