import User from "../models/user.model"




export function authMiddleware(adminOnly = false){
    /**@type {import("express").Handler} */
    return (req, res, next)=>{
        const user = User.findOne()
        req.user = user
    }
}