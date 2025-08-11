import express from 'express'
import { addComment, getCommentsByProductId } from '../controllers/comment.controller.js';

const Router = express.Router()
Router.post("/create", addComment)
Router.get("/all/comments", getCommentsByProductId)
export default Router;