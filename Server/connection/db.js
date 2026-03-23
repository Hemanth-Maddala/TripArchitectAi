const mongoose = require("mongoose");

async function connecttodb(){
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri).then(()=>{
        console.log("connected to mongoDb");
    })
}

module.exports = connecttodb;