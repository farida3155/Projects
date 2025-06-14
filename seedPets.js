const mongoose = require('mongoose');
const Pet = require('./models/petSchema.js'); // Adjust path if needed
require('dotenv/config');

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then (()=>{
  console.log("Database Connection Successful!")
})
.catch((err)=>{
  console.log(err)
});

const pets = [
  {
    name: "Nemo",
    age: { value: 5, unit: "years" },
    breed: "Shirazi",
    gender: "Male",
    neutered: "Yes",
    location: "Cairo",
    image: "/uploads/nemo.jpg",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Mimi",
    age: { value: 3, unit: "years" },
    breed: "Shirazi",
    gender: "Female",
    neutered: "No",
    location: "Giza",
    image: "/uploads/mimi.jpg",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Barbie",
    age: { value: 1, unit: "year" },
    breed: "Shirazi",
    gender: "Female",
    neutered: "No",
    location: "Cairo",
    image: "/uploads/barbie.jpeg",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Minnie",
    age: { value: 1, unit: "year" },
    breed: "Shirazi",
    gender: "Female",
    neutered: "No",
    location: "Cairo",
    image: "/uploads/minnie.jpeg",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Caramel",
    age: { value: 3, unit: "years" },
    breed: "Shirazi",
    gender: "Female",
    neutered: "Yes",
    location: "Cairo",
    image: "/uploads/caramel.jpg",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Bennetton",
    age: { value: 1, unit: "year" },
    breed: "Shirazi",
    gender: "Female",
    neutered: "No",
    location: "Cairo",
    image: "/uploads/bennetton.jpg",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Hadoota",
    age: { value: 2, unit: "years" },
    breed: "Balady",
    gender: "Female",
    neutered: "No",
    location: "Ismailia",
    image: "/uploads/hadoota.jpg",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Leila",
    age: { value: 2, unit: "years" },
    breed: "Persian",
    gender: "Female",
    neutered: "No",
    location: "Port Said",
    image: "/uploads/persian.jpg",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Luna",
    age: { value: 3, unit: "years" },
    breed: "Ragdoll",
    gender: "Female",
    neutered: "Yes",
    location: "Alexandria",
    image: "/uploads/ragdoll.jpg",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Snickers",
    age: { value: 1, unit: "year" },
    breed: "Balady",
    gender: "Female",
    neutered: "No",
    location: "Cairo",
    image: "/uploads/snickers.png",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Meshmesh & Simba",
    age: { value: 2, unit: "months" },
    breed: "Shirazi/Balady",
    gender: "Female",
    neutered: "No",
    location: "Cairo",
    image: "/uploads/twins.jpg",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Monkey",
    age: { value: 5, unit: "years" },
    breed: "Shirazi/Balady",
    gender: "Male",
    neutered: "No",
    location: "Giza",
    image: "/uploads/monkey.jpg",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Snow",
    age: { value: 3, unit: "years" },
    breed: "Shirazi",
    gender: "Male",
    neutered: "Yes",
    location: "Cairo",
    image: "/uploads/snow.jpeg",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Tooty",
    age: { value: 3, unit: "years" },
    breed: "Shirazi",
    gender: "Female",
    neutered: "No",
    location: "Ismailia",
    image: "/uploads/tooty.jpg",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Bondo'",
    age: { value: 6, unit: "years" },
    breed: "Shirazi/Balady",
    gender: "Male",
    neutered: "Yes",
    location: "Cairo",
    image: "/uploads/bondo2.jpeg",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Fangs",
    age: { value: 3, unit: "years" },
    breed: "Shirazi",
    gender: "Male",
    neutered: "No",
    location: "Alexandria",
    image: "/uploads/fangs.jpeg",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Moro",
    age: { value: 4, unit: "months" },
    breed: "Ragdoll",
    gender: "Male",
    neutered: "No",
    location: "Giza",
    image: "/uploads/moro.jpeg",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Kiara",
    age: { value: 5, unit: "years" },
    breed: "Shirazi",
    gender: "Female",
    neutered: "Yes",
    location: "Cairo",
    image: "/uploads/kiara.jpg",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Bondo'a",
    age: { value: 1, unit: "year" },
    breed: "Balady",
    gender: "Female",
    neutered: "No",
    location: "Giza",
    image: "/uploads/bondo2a.jpeg",
    upForAdoption: true,
    type: 'cat'
  },
  {
    name: "Astro",
    age: { value: 3, unit: "months" },
    breed: "German Shepherd",
    gender: "Male",
    neutered: "No",
    location: "Cairo",
    image: "/uploads/Astro.jpeg",
    upForAdoption: true,
    type: 'dog'
  },
  {
    name: "Brownie",
    age: { value: 2, unit: "months" },
    breed: "Dachshund",
    gender: "Male",
    neutered: "No",
    location: "Cairo",
    image: "/uploads/brownie.jpeg",
    upForAdoption: true,
    type: 'dog'
  },
  {
    name: "Bruce",
    age: { value: 1, unit: "year" },
    breed: "Pitbull",
    gender: "Male",
    neutered: "No",
    location: "Giza",
    image: "/uploads/bruce.jpeg",
    upForAdoption: true,
    type: 'dog'
  },
  {
    name: "Bruno",
    age: { value: 6, unit: "months" },
    breed: "German Shepherd",
    gender: "Male",
    neutered: "No",
    location: "Giza",
    image: "/uploads/bruno.jpeg",
    upForAdoption: true,
    type: 'dog'
  },
  {
    name: "Buddy",
    age: { value: 4, unit: "years" },
    breed: "Griffon",
    gender: "Male",
    neutered: "Yes",
    location: "Cairo",
    image: "/uploads/buddy.jpg",
    upForAdoption: true,
    type: 'dog'
  },
  {
    name: "Casper",
    age: { value: 7, unit: "months" },
    breed: "Samoyed",
    gender: "Male",
    neutered: "No",
    location: "Alexandria",
    image: "/uploads/casper.jpeg",
    upForAdoption: true,
    type: 'dog'
  },
  {
    name: "Daisy",
    age: { value: 4, unit: "months" },
    breed: "Cocker Spaniel",
    gender: "Female",
    neutered: "No",
    location: "Alexandria",
    image: "/uploads/daisy.jpeg",
    upForAdoption: true,
    type: 'dog'
  },
  {
    name: "Fosdo'2a",
    age: { value: 2, unit: "years" },
    breed: "Balady",
    gender: "Female",
    neutered: "No",
    location: "Giza",
    image: "/uploads/fosdo2a.jpeg",
    upForAdoption: true,
    type: 'dog'
  },
  {
    name: "Max",
    age: { value: 1, unit: "year" },
    breed: "Golden Retriever",
    gender: "Male",
    neutered: "No",
    location: "Port Saeed",
    image: "/uploads/Max.jpeg",
    upForAdoption: true,
    type: 'dog'
  },
  {
    name: "Milo",
    age: { value: 3, unit: "years" },
    breed: "Volpino",
    gender: "Male",
    neutered: "No",
    location: "Cairo",
    image: "/uploads/milo.jpeg",
    upForAdoption: true,
    type: 'dog'
  },
  {
    name: "Oreo",
    age: { value: 5, unit: "years" },
    breed: "Balady",
    gender: "Female",
    neutered: "No",
    location: "Alexandria",
    image: "/uploads/oreo.jpeg",
    upForAdoption: true,
    type: 'dog'
  },
  {
    name: "Oreo",
    age: { value: 5, unit: "years" },
    breed: "Cocker Spaniel",
    gender: "Male",
    neutered: "No",
    location: "Ismailia",
    image: "/uploads/oreo.png",
    upForAdoption: true,
    type: 'dog'
  },
  {
    name: "Reeses",
    age: { value: 3, unit: "months" },
    breed: "Rottweiler",
    gender: "Male",
    neutered: "No",
    location: "Ismailia",
    image: "/uploads/reeses.jpeg",
    upForAdoption: true,
    type: 'dog'
  },
  {
    name: "Luna & Snow",
    age: { value: 3, unit: "years" },
    breed: "Husky & Samoyed",
    gender: "Female",
    neutered: "No",
    location: "Alexandria",
    image: "/uploads/siblings.jpeg",
    upForAdoption: true,
    type: 'dog'
  },
  {
    name: "Smokey",
    age: { value: 1, unit: "year" },
    breed: "Labrador",
    gender: "Male",
    neutered: "No",
    location: "Cairo",
    image: "/uploads/smokey.jpeg",
    upForAdoption: true,
    type: 'dog'
  },
  {
    name: "Steve",
    age: { value: 1, unit: "year" },
    breed: "Corgi",
    gender: "Male",
    neutered: "No",
    location: "Cairo",
    image: "/uploads/steve.jpeg",
    upForAdoption: true,
    type: 'dog'
  },
  {
    name: "Zaatar",
    age: { value: 9, unit: "months" },
    breed: "Golden Retriever",
    gender: "Male",
    neutered: "No",
    location: "Alexandria",
    image: "/uploads/Zaatar.jpeg",
    upForAdoption: true,
    type: 'dog'
  },
  {
    name: "Zoro",
    age: { value: 2, unit: "months" },
    breed: "Dachshund",
    gender: "Male",
    neutered: "No",
    location: "Port Saeed",
    image: "/uploads/zoro.jpeg",
    upForAdoption: true,
    type: 'dog'
  },
  {
    name: "Bondo'a",
    age: { value: 2, unit: "years" },
    breed: "Cocker Spaniel",
    gender: "Female",
    neutered: "No",
    location: "Giza",
    image: "/uploads/dbondo2a.jpeg",
    upForAdoption: true,
    type: 'dog'
  }
];


async function seed() {
  try {
    await Pet.deleteMany({});
    await Pet.insertMany(pets);
    console.log('Seeding success!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Seeding error:', err);
    mongoose.disconnect();
  }
}

seed();