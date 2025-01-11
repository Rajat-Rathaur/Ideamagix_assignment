import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    profilePicture: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    historyOfSurgery: { type: String },
    historyOfIllness: { type: String }, // Array to store multiple illnesses
    password: { type: String, required: true }, // Added password field
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
