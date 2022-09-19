const express = require('express')
const router = express.Router()
const verifyToken = require('../../middleware/auth')
const Post = require('../Post')

// @route DELETE api/posts
// @desc Delete post
// @access Private
router.delete('/P/:id', verifyToken, async(req, res) => {
    try {
        const postDeleteCondition = {_id: req.params.id, user: req.userId}
        const deletedPost = await Post.findOneAndDelete(postDeleteCondition)

        //user not authorized to delete posts or post not found
      if(!deletedPost)
      return res.status(401).json({success: false, message: 'Post not found or not authorized'})

      res.json({success: true, message:'Deleted!', post: deletedPost})

     }catch(error) {
         console.log(error)
         res.status(500).json({success: false, message: 'Internal server error'})
    }
})


// @route PUT api/posts
// @desc Update post
// @access Private
router.put('/P/:id', verifyToken, async (req, res) => {
    const {title, description, url, status} = req.body

     //Simple validation
     if(!title)
     return res.status(400).json({success: false, message:'Title is required'})
 
     try {
         let updatedPost = {title,
                            description: description || '',
                            url: (url.startsWith('http://') ? url : `http://${url}`) || '',
                            status: status || 'To Learn'}
        
     const postUpdateCondition = {_id: req.params.id, user: req.userId}
     updatedPost = await Post.findOneAndUpdate(postUpdateCondition, updatedPost, {new: true})
     
     //user not authorized to update posts or post not found
      if(!updatedPost)
      return res.status(401).json({success: false, message: 'Post not found or not authorized'})

      res.json({success: true, message: 'Excellent progress!', post: updatedPost})

     }catch(error) {
         console.log(error)
         res.status(500).json({success: false, message: 'Internal server error'})}
})


// @route GET api/posts
// @desc get post
// @access Private
router.get('/P', verifyToken, async(req, res) => {
    try {
        const posts = await Post.find({user: req.userId}).populate('user', ['username'])
        res.json({success: true, posts})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})


// @route POST api/posts
// @desc Create post
// @access Private
router.post('/P', verifyToken, async(req, res) => {
    const{title, description, url, status} = req.body

    //Simple validation
    if(!title)
    return res.status(400).json({success: false, message:'Title is required'})

    try {
        const newPost = new Post({title, description, url: (url.startsWith('http://')) ? url : `http://${url}`,
        status: status || 'To Learn', 
        user: req.userId
    })
       
    await newPost.save()
    res.json({success: true, message: 'Happy learning!!', post: newPost})
    
    }catch(error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})}
})

module.exports = router