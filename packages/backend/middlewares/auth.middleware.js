import User from "../models/user.model"




export function authMiddleware(adminOnly = false){
    /**@type {import("express").Handler} */
    return async (req, res, next)=>{
        const user = await User.findOne()
        req.user = user
        next()
    }
}