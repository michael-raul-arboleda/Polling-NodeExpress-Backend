// /api/posts
const express = require("express");
const Post = require("../models/post");
const multer = require("multer");


const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       const isValid = MIME_TYPE_MAP[file.mimetype];
       let error = new Error('Invalid mime type');
       if(isValid){
           error = null;
       }
       cb(error, '../user_uploaded_images');
    },
    filename: (req, file, cb) => {
        const name = file.orginalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        const fullFillName = name + '-' + Date.now() + '.' + ext;
        cb(null, fullFillName);
    }
});


router.post("", multer(storage).single('image'), (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then( result => {
        res.status(201).json({
            message: 'Post added successfully',
            postId: result._id
        });
    });
});

router.get("", (req, res, next) => {
    Post.find()
        .then(documents => {
            console.log(documents);
            res.status(200).json({
                message: 'Post fetched succesfully',
                posts: documents
            });
        });
});

router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post){
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post not found!'});
        }
    });
});

router.put('/:id', (req, res, next) => {
    const post = new Post({
        _id: req.body._id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post)
        .then(result => {
            res.status(200).json({ message: 'Successful update!'})
        });
});

router.delete("/:id", (req, res, next) => {
    console.log('Hello\t' + req.params.id);
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: 'Post Deleted!'});
    });
});

module.exports = router;
