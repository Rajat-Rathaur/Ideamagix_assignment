import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    profilePicture: { type: String, required: true },
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    experience: { type: Number, required: true },
    password: { type: String, required: true }, // Added password field
});

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
