import { Request, Response } from "express";
import { Post } from "../models/Post";
import { commentRepository } from "../repositories/CommentRepository";
import { postRepository } from "../repositories/PostRepository";

export class CommentController {
    static async create(req: Request, res: Response) {
        const postId = req.params.post_id
        const { content } = req.body

        if(!content){
            return res.status(400).json('Fill all Fields')
        }
        const post = await postRepository.findOneBy({ id: Number(postId) })
        
        if(!post){
            return res.status(400).json('Unexpected Post')
        }

        const dateComment = new Date()
        const newComment = await commentRepository.create({ content, date: dateComment, user: req.user, post})

        await commentRepository.save(newComment)

        return res.status(200).json(newComment)

    }

    static async showComments(req: Request, res: Response){

        const postId = req.params.post_id

        const post = await postRepository.findOneBy({ id: Number(postId) })

        if(!post){
            return res.status(400).json('Unexpected Post')
        }

        const comments = await commentRepository.findBy({ post })

        return res.status(200).json(comments)
    }
}