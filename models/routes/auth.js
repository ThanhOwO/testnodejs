const express = require('express');
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const User = require('../User')


// @route POST api/auth/registered
// @desc Register user
// @access Public
router.post('/register', async(req, res) => {
    const {username, password} = req.body

    //Simple validation
    if(!username || !password) return res.status(400).json({success: false, message: 'Missing username or password'})
    
    try {
        //check for existing username
        const user = await User.findOne({username})

        if (user)
        return res.status(400).jason({success: false, message: 'Username already taken'})

        //All good to go
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({username, hashedPassword})
        await newUser.save()

        //Return tokens
        const accessToken = jwt.sign({userId: newUser._id}, process.env.ACCESS_TOKEN_SECRET)

        res.json({success: true, message: 'User created successfully', accessToken})
    }catch(error) {}
})

router.get('/', (req, res) => res.send('USER ROUTE'))

module.exports = router 