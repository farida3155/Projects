
const mongoose = require('mongoose');

const acceptedFormSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true, min: 21 },
  phone: { type: String, required: true },
  altPhone: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  socialMediaUrl: { type: String, required: true },
  reasonForAdoption: { type: String, required: true },
  timeLookingToAdopt: { type: String, required: true },
  spayingThoughts: { type: String, required: true },
  petcoApplication: String,
  hadCats: String,
  childrenAtHome: String,
  childrenAge: String,
  fencedYard: String,
  homeType: String,
  otherPets: String,
  houseSupport: String,
  aloneTime: String,
  vetCheckups: String,
  petExperience: String,
  petAllergies: String,
  exercisePlan: { type: String, required: true },
  travelFrequency: String,
  vacationPlan: { type: String, required: true },
  specialNeeds: String,
  vetAvailable: { type: String, required: true },
  vetCostEstimate: { type: String, required: true },
  vetEmergencyReady: { type: String, required: true },
  petInsurance: String,
  monthlyExpenses: { type: String, required: true },
  lifeChanges: { type: String, required: true },
  stressManagement: { type: String, required: true },
  commitment: { type: String, required: true },
  whyFit: { type: String, required: true },
  petIntroduction: String,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AcceptedForm", acceptedFormSchema,"form-accepted");
