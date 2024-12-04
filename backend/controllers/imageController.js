const Image = require('../models/imageModel')

exports.uploadImage = async (req, res) => {

  const { location, date, description } = req.body;

  const files = req.files

  //backend Validation
  // Check if any required fields are missing
  if (!location || !date || !description || !files || files.length === 0) {

    console.log("error: provide all required fields and at least one image file.")
    return res.status(400).json({ error: "Please provide all required fields and at least one image file." });
  }

  const currentDate = new Date();
  const memoryDate = new Date(date);

  //backend Validation
  // Check if date is not in future

  if (memoryDate > currentDate) {
    console.log("error: Memory date cannot be a future date.")
    return res.status(400).json({ error: "Memory date cannot be a future date." });
  }

  const savedFilenames = []

  for (const file of files) {

    savedFilenames.push("http://localhost:5000/static/images/" + file.filename); // Store saved filename
  }
  try {

    console.log("Saved file Names" + savedFilenames)
    await Image.create({
      image: savedFilenames,
      location: location,
      date: date,
      description: description
    });
    res.json({ status: "Memory added successfully" });
  } catch (error) {
    res.json({ status: error });
  }
}



exports.getImages = async (req, res) => {
  try {
    const images = await Image.find({});
    console.log("Get images response : " + images)
    res.send({ status: "ok", data: images });
  } catch (error) {
    res.status(500).json({ status: error.message });
  }
}

exports.updateImages = async (req, res) => {

  

  const files = req.files

  const savedFilenames = []

  for (const file of files) {

    savedFilenames.push("http://localhost:5000/static/images/" + file.filename); // Store saved filename
  }
  try {

    const id = req.params.id
    const updateBody = {
      
      image:savedFilenames,
      location: req.body.location,
      date: req.body.date,
      description: req.body.description
    }

    //backend Validation
  // Check if any required fields are missing
  if (!req.body.location || !req.body.date || !req.body.description || !savedFilenames || savedFilenames.length === 0) {

    console.log("error: provide all required fields and at least one image file.")
    return res.status(400).json({ error: "Please provide all required fields and at least one image file." });
  }

  const currentDate = new Date();
  const memoryDate = new Date(req.body.date);

  //backend Validation
  // Check if date is not in future

  if (memoryDate > currentDate) {
    console.log("error: Memory date cannot be a future date.")
    return res.status(400).json({ error: "Memory date cannot be a future date." });
  }


    const updatedImage = await Image.findByIdAndUpdate(id, updateBody)

    res.status(200).json({ status: 'ok', data: updatedImage })

  } catch (error) {
    res.status(500).json({ status: error.message });
  }


}

exports.deleteImages = async (req, res) => {
  try {
    const deletedImage = await Image.findByIdAndDelete(req.params.id);
    if (!deletedImage) {
      return res.status(404).json({ error: "Image not found" });
    }
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.updateViewCount = async (req, res) => {
  try {
    const imageId = req.params.id;
    // Find the image by ID and update its viewCount field
    const updatedImage = await Image.findByIdAndUpdate(
      imageId,
      { $inc: { viewCount: 1 } }, // Increment the viewCount field by 1
      { new: true } // Return the updated document
    );

    if (!updatedImage) {
      return res.status(404).json({ error: "Memory not found" });
    }

    res.json({ message: "View count updated successfully", image: updatedImage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

