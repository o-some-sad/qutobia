import express from 'express';
import multer from 'multer';
import { addBook } from '../controllers/book.controller.js';

// const upload = multer({ dest: 'uploadedImgs/' }); // to store ALL uploads
const router = express.Router();

// diskStorage for storage on disk NOT memory
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      // cb to return the processed fileName
      // Date.now() --> to ensure every fileName is unique
      cb(null, Date.now() + "--" + file.originalname);
    },
    // where the uploads folder is
    destination: function (req, file, cb) {
      cb(null, "./uploads");
    },
  });

  const upload = multer({
    storage: storage,
  });


// using multer (middleware)
// **** Do I've to make 2 fields one for imageURL and one for imageFILE ?????????
  router.post('/books', upload.single('image'), async (req, res) => {
    let formData = req.body;
    if (req.file === undefined) {
        return res.status(400).json({ msg: "Please upload an image!" }); // if NO uploaded img
    }

    const imageUrl = req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename; 
    // we do this to be able to fetch the img path correctly when we want it
    // to sth to be able to use it as there's NO 'file' datatype
    const bookData = { ...formData, image: imageUrl };  // spread operator to concat image with body

    try {
        const newBook = await addBook(bookData);
        res.status(200).json({ message: "Book added successfully !", data: newBook });
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(400).json({ message: "Failed to add a book !" });
    }
});


export default router





// router.get(); // get ALL or get by filters
// router.get(); // get by ID
// router.patch(); // modify a book's details
// router.delete(); // delete a book