import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    currentIllness: { type: String, required: true },
    recentSurgery: { type: String },
    familyMedicalHistory: {
        diabeticStatus: { type: String, enum: ['Diabetic', 'Non-Diabetic'], required: true },
        allergies: { type: String },
        others: { type: String }
    },
    payment: { transactionId: { type: String, required: true } },
   
    createdAt: { type: Date, default: Date.now }
});

const Consultation = mongoose.model('Consultation', consultationSchema);

export default Consultation;
