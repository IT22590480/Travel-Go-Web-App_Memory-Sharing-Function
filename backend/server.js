const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const imageRouter = require('./routes/imageRoutes')
const path = require('path')
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected..."))
.catch((err) => console.log(err));

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use('/api/image', imageRouter)

// Start Server
app.listen(PORT, () => console.log(`Listening at ${PORT}`));
