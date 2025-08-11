import commentModel from "../models/commentProduct.model.js";

export const addComment = async (req, res) => {
    try {
        const { productId, text, star } = req.body;
        const newComment = new commentModel({ productId, text, star });
        await newComment.save();
        res.status(201).json({ message: "Comment added successfully", comment: newComment });
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }   
};

export const getCommentsByProductId = async (req, res) => {
    try {
        const { productId } = req.params;
        const comments = await commentModel.find( productId ) // populate feature can be added later.
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments", error: error.message });
    }
};