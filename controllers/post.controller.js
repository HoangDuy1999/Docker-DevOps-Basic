const postModel = require('../models/post.model')

exports.getAllPosts = async (req, res, next) => {
    try{
    const conditions = req.query;
    const posts = await postModel.find({});

    return res.status(200).json({ error: false, data: posts, message: 'getAllPosts' })
    }catch(e){
        console.log(e.message)
    }
}

exports.getInfoPostByID = async (req, res, next) => {
    const id = req.params.id;
    const post = await postModel.findOne({ _id: id });

    return res.status(200).json({ error: false, data: post, message: 'getInfoPostByID' })
}

exports.createPost = async (req, res, next) => {
    try{
    const doc = await postModel.create(req.body)

    return res.status(200).json({ error: false, data: doc, message: 'getInfoPostByID' })
    }catch(e){
        return res.status(400).json({error: true, data: null,message: e?.message})
    }
}


exports.updatePost = async (req, res, next) => {
    const signalUpdate = await postModel.updateOne({ _id: req.params._id }, { $set: req.body });
    const code = signalUpdate.modifiedCount < 1 ? 400 : 200;
    return res.status(code).json({ error: false, data: signalUpdate, message: 'getInfoPostByID' })
}

exports.deletePost = async (req, res, next) => {
    const signalDelete = await postModel.deleteOne({ _id: req.params._id });
    const code = signalUpdate.deletedCount < 1 ? 400 : 200;

    return res.status(code).json({ error: false, data: signalDelete, message: 'getInfoPostByID' })
}