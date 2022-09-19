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
        const user = await User.findOne({username: username})

        if (user)
        return res.status(400).json({success: false, message: 'Username already taken'})

        //All good to go
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({username, password: hashedPassword})
        await newUser.save()

        //Return tokens
        const accessToken = jwt.sign({userId: newUser._id}, process.env.ACCESS_TOKEN_SECRET)

        res.json({success: true, message: 'User created successfully', accessToken})
    }catch(error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})

// @route POST api/auth/login
// @desc Login user
// @access Public

router.post('/login', async (req, res) => {
    const {username, password} = req.body

    //Simple validation
    if(!username || !password) return res.status(400).json({success: false, message: 'Missing username or password'})

    try{
        //Check for existing user
        const user = await User.findOne({username: username})
        if(!user)
        return res.status(400).json({success: false, message: 'Invalid username or password'})

        //User found
        const passwordValid = await argon2.verify(user.password, password)
        if(!passwordValid)
        return res.status(400).json({success: false, message: 'Invalid username or password'})

        //All good to go
        //Return tokens
        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET)

        res.json({success: true, message: 'Login successfully', accessToken})
    }catch(error){
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }

})

module.exports = router 