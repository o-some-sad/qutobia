import express from 'express';
import multer from 'multer';
import { addBook } from '../controllers/book.controller.js';

const upload = multer({ dest: 'uploadedImgs/' }); // to store ALL uploads
const router = express.Router();


// for the images in uploads to be saved correctly in their own format
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads/')
//     },
//     filename: function (req, file, cb) {
//       crypto.pseudoRandomBytes(16, function (err, raw) {
//         cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
//       });
//     }
//   });
//   var upload = multer({ storage: storage });


// using multer (middleware)
router.post('/books', upload.single('image'), async(req, res, next) => {
    let body = req.body;
    let image = req.file;
    const data = await addBook(body, image);
    if(!image){
        return res.status(400).send('Please upload an image !');
    }
    res.status(200).json({
        message: "Book added successfully !",
        data: data
    });})

export default router





// router.get(); // get ALL or get by filters
// router.get(); // get by ID
// router.patch(); // modify a book's details
// router.delete(); // delete a book