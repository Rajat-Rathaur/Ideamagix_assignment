import Consultation from '../models/consultationModel.js';
import Doctor from '../models/doctorModel.js';
import Patient from '../models/patientModel.js';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid'; 
/** =========================
 *  Create Consultation
 *  ========================= */
export const createConsultation = async (req, res) => {
    const { patientId, doctorId, illnessHistory, recentSurgery, familyMedicalHistory, paymentAmount } = req.body;

    try {
        // Check if the doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Check if the patient exists
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Generate a unique transaction ID
        const transactionId = uuidv4();

        // Generate a QR code for payment
        const paymentData = {
            transactionId,
            amount: paymentAmount,
            description: `Payment for consultation with Dr. ${doctor.name}`,
        };

        const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(paymentData));

        // Create a consultation entry in the database with initial payment status
        const consultation = new Consultation({
            doctorId,
            patientId,
            illnessHistory,
            recentSurgery,
            familyMedicalHistory,
            payment: {
                transactionId,
                amount: paymentAmount,
                status: 'Pending', // Payment status set to pending
            },
        });

        await consultation.save();

        // Respond with QR code and consultation details
        res.status(201).json({
            message: 'Consultation created successfully. Complete the payment to proceed.',
            consultation,
            qrCode: qrCodeUrl,
        });
    } catch (error) {
        console.error('Error creating consultation:', error.message);
        res.status(500).json({ message: 'Error creating consultation', error: error.message });
    }
};
/** =========================
 *  Get Consultations by Doctor
 *  ========================= */
export const getConsultationsByDoctor = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const consultations = await Consultation.find({ doctorId }).populate('patientId', 'name email');
        if (!consultations) {
            return res.status(404).json({ message: 'No consultations found for this doctor' });
        }

        res.status(200).json(consultations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching consultations', error: error.message });
    }
};

/** =========================
 *  Get Consultations by Patient
 *  ========================= */
export const getConsultationsByPatient = async (req, res) => {
    const { patientId } = req.params;

    try {
        const consultations = await Consultation.find({ patientId }).populate('doctorId', 'name specialty');
        if (!consultations) {
            return res.status(404).json({ message: 'No consultations found for this patient' });
        }

        res.status(200).json(consultations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching consultations', error: error.message });
    }
};

/** =========================
 *  Update Consultation
 *  ========================= */
export const updateConsultation = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedConsultation = await Consultation.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedConsultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }

        res.status(200).json({ message: 'Consultation updated successfully', updatedConsultation });
    } catch (error) {
        res.status(500).json({ message: 'Error updating consultation', error: error.message });
    }
};

/** =========================
 *  Delete Consultation
 *  ========================= */
export const deleteConsultation = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedConsultation = await Consultation.findByIdAndDelete(id);
        if (!deletedConsultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }

        res.status(200).json({ message: 'Consultation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting consultation', error: error.message });
    }
};

/** =========================
 *  Get Consultation by ID
 *  ========================= */
export const getConsultationById = async (req, res) => {
    const { id } = req.params;

    try {
        const consultation = await Consultation.findById(id).populate('patientId doctorId', 'name email specialty');
        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }

        res.status(200).json(consultation);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching consultation', error: error.message });
    }
};
