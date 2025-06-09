const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv/config');

const api = process.env.API_URL;
const petRouter = require('./routers/petRouter.js')
const Pet = require('./models/petSchema.js');

app.use(express.json());
app.use(morgan('tiny'));
app.use(api+'/pets', petRouter);
app.use(cors());
app.options('*',cors());


app.get(api+'/pets', async (req,res) => {
  const petList = await Pet.find();

  if (!petList){
    res.status(500).json({success: false})
  }
  res.send(petList);
});

app.post(api+'/pets', (req,res) => {
  const pet = new Pet({
    name: req.body.name,
    age: req.body.age,
    breed: req.body.breed,
    gender: req.body.gender,
    neutered: req.body.neutered,
    location: req.body.location,
    image: req.body.image,
    upForAdoption: req.body.upForAdoption,
    type: req.body.type,
  })
  pet.save().then((newPet)=>{
    res.status(201).json(newPet)
  }).catch((err)=>{
    res.status(500).json({
      err: err,
      success: false
    })
  });
});

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then (()=>{
  console.log("Database Connection Successful!")
})
.catch((err)=>{
  console.log(err)
});
console.log("welcome to petco!");
app.listen(5555, () => console.log('Server running on http://localhost:5555'));