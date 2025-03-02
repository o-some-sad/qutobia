import express from 'express'

const router = express.Router();

router.route('/')
.get((req,res)=>{

    //const user ={isAdmin:true,}
    res.json({message:"orders"})
})
.post()

router.route('/:id')
.get()
.patch()

export default router;