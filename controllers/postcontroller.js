const postmodel=require('../models/postmodel')
const mongoose=require('mongoose')



exports.addpost = async (req, res) => {
    try {
        const { userid } = req.payload;
        const { username, title, bio, thought, date } = req.body;

        const newPost = new postmodel({
            username,
            title,
            date,
            bio,
            thought,
            userid, // Store user ID as string
            user: new mongoose.Types.ObjectId(userid) // Convert to ObjectId properly
        });

        await newPost.save();
        res.status(201).json(newPost);

    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
};

exports.getallpost=async(req,res)=>{
    try{
        const postlists=await postmodel.find()
        res.status(200).json(postlists)

    }
    catch(err){
        console.log(err)
        res.status(400).json(err)
    }
}
exports.getindividualpost=async(req,res)=>{
    try{
        const{userid}=req.params
        const posts=await postmodel.find({userid})
        res.status(200).json(posts)


    }
    catch(err){
        console.log(err)
        res.status(400).json(err)
    }
}
exports.deletepost = async (req, res) => {
    try {
        const { postid } = req.params;
        const { userid } = req.payload; // Extract user ID from JWT

        // Fetch post from database
        const post = await postmodel.findById(postid);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Compare `userid` instead of `user`
        if (post.userid !== userid) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }

        // Delete the post
        await postmodel.findByIdAndDelete(postid);
        res.status(200).json({ message: "Post deleted successfully" });

    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
};
exports.likePost = async (req, res) => {
    try {
        const { postid } = req.params;
        const { userid } = req.payload; 
        const post = await postmodel.findById(postid);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        
        const likedIndex = post.likes.indexOf(userid);
        if (likedIndex === -1) {
            post.likes.push(userid); 
        } else {
            post.likes.splice(likedIndex, 1); 
        }

        await post.save();
        res.status(200).json({ likes: post.likes.length, liked: likedIndex === -1 });

    } catch (error) {
        console.error("Error liking/unliking post:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
