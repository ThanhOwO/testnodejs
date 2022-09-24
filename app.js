require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authRouter = require('./models/routes/auth')
const postRouter = require('./models/routes/post')

//connect mongodb server
const connectDB = async () => {
  try {
    mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mydb.fldonuh.mongodb.net/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })

    console.log('MongoDB connected')
  } catch (error) {
    console.log('Error connecting to MongoDB')
    process.exit(1)
  }
}

 
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)

app.listen(process.env.PORT || 3000)
 
connectDB()