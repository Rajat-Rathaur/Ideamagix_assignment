import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
    consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    careInstructions: { type: String, required: true },
    medicines: { type: String },
    pdfPath: { type: String, required: true }, // Path to the generated PDF file
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;
