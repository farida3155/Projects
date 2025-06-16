const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const https = require('https');
const multer = require('multer');

require('dotenv/config');

const app = express();
const api = process.env.API_URL;


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

// Routes
const petRouter = require('./routes/petRoute.js');
const postRequestRouter = require('./routes/postRequestRoute.js');
const newsletterRoutes = require('./routes/newsletter');
const adminEventsRoutes = require('./routes/admineventsroute');
const authRoutes = require('./routes/loginroute');
const adminCrudRoutes = require('./routes/adminsroute');
const donationRoutes = require('./routes/donation');

app.use(api + '/pets', petRouter);
app.use(api + '/post-requests', postRequestRouter);
app.use('/api', newsletterRoutes);
app.use('/admin', adminEventsRoutes);
app.use("/admin-api", require("./routes/admin"));
app.use("/api/contact", require("./routes/api/contact"));
app.use("/api/contact-requests", require("./routes/api/contactreq"));
app.use("/api/adoption", require("./routes/api/form"));
app.use("/api/adoption-requests", require("./routes/api/formreq"));
app.use("/api/adoption-history", require("./routes/api/history"));
app.use("/api/admin/insights", require("./routes/api/insights"));
app.use('/api', authRoutes);
app.use('/api', donationRoutes);
app.use('/api/admins', adminCrudRoutes);
app.use('/api/donations-requests', require("./routes/api/donation"));
// Models
const Pet = require('./models/petSchema.js');
const PostRequest = require('./models/postRequestSchema.js');


// Static Files
app.use('/uploads', express.static('public/uploads'));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, "views")));
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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'eventspage.html'));
  });
  app.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'forgot-password.html'));
  });
  
app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'reset-password.html'));
  });
//ERROR HANDLING
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
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
//login route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/donations', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'donations.html'));
});


const options = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem')
  };
  
  https.createServer(options, app).listen(3000, () => {
    console.log('🔒 HTTPS server running on https://localhost:3000');
  });