const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv/config');

const app = express();
const api = process.env.API_URL;

// Routers
const petRouter = require('./routers/petRouter.js');
const postRequestRouter = require('./routers/postRequestRouter.js');
// Routes
app.use(api + '/pets', petRouter);
app.use(api + '/post-requests', postRequestRouter);



// Models
const Pet = require('./models/petSchema.js');
const PostRequest = require('./models/postRequestSchema.js');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

// Static Files
app.use('/uploads', express.static('public/uploads'));
app.use(express.static(path.join(__dirname, "public")));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



// Adoption Page Route
app.get('/adopt', async (req, res) => {
    const cats = await Pet.find({ type: 'cat', upForAdoption: true });
    const dogs = await Pet.find({ type: 'dog', upForAdoption: true });
 
    const catBreeds = [...new Set(cats.map(p => p.breed))];
    const dogBreeds = [...new Set(dogs.map(p => p.breed))];
    const catLocations = [...new Set(cats.map(p => p.location))];
    const dogLocations = [...new Set(dogs.map(p => p.location))];
    
    res.render('adopt', {
        cats,
        dogs,
        catBreeds,
        dogBreeds,
        catLocations,
        dogLocations
    });
});

// Database Connection
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Database Connection Successful!");
})
.catch((err) => {
    console.log(err);
});

// Server Start
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
    console.log(`API available at ${api}`);
});