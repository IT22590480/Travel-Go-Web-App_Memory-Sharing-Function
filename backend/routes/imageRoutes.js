const {uploadImage,getImages,updateImages,deleteImages,updateViewCount} = require('../controllers/imageController')

const express = require('express')
const router = express.Router()
const multer = require('multer');
const path = require('path');

// Multer Configuration
const storage = multer.diskStorage({
  
  destination: function (req, file, cb) {

    cb(null, path.join(__dirname, "../static/images/")); // Adjust destination path
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
    
  }
}); 

// Multer Instance
const upload = multer({ storage: storage });

// Both single & multiple Image Upload Endpoint
router.post("/single", upload.array("image", 10), async (req, res) => {
    await uploadImage(req,res)
});



// Get Images Endpoint
router.get("/", async(req,res) => {
    await getImages(req,res)
});

router.patch('/:id', upload.array("image", 10),  async(req,res)=> {
    await updateImages(req,res)
})

// Delete Image Endpoint
router.delete("/:id", async (req, res) => {
    await deleteImages(req,res)
});

// Increment View Count Endpoint
router.patch("/increment-view/:id", async (req, res) => {
  await updateViewCount(req, res);
});


module.exports = router

