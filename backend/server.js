const express = require('express')
const connectdb = require('./config/connectdb')
require("dotenv").config()
const cors = require('cors')
const app = express()

connectdb()

//console.log(process.env.MONGO_URI)


app.use(express.json())
app.use(cors())
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/products", require("./routes/productRoutes")) 
app.use("/user", require("./routes/userRoutes"))

const port = 5000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))