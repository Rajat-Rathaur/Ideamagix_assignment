import express from 'express';
import {
    signupDoctor,
    signinDoctor,
    getDoctorById,
    updateDoctorById,
    deleteDoctorById,
    updateDoctorPassword,
    getAllDoctors
} from '../controllers/doctorController.js';
import { upload } from '../middleware/fileUpload.js'; // Import the upload middleware

import {
    signupPatient,
    signinPatient,
    getPatientById,
    updatePatientById,
    deletePatientById,
    updatePatientPassword
} from '../controllers/patientController.js';

import {
    createConsultation,
    getConsultationsByDoctor,
    getConsultationsByPatient,
    updateConsultation,
    deleteConsultation,
    getAllConsultations
} from '../controllers/consultationController.js';

import {
    createPrescription,
    getPrescriptionsByDoctor,
    getPrescriptionById,
    updatePrescription,
    deletePrescription,
    getPrescriptionsByPatientId,
    getPrescriptionsByDoctorAndPatient
} from '../controllers/prescriptionController.js';

import reqAuth from '../middleware/reqAuth.js';

const router = express.Router();

/** =========================
 *  Doctor Routes
 *  ========================= */
router.post('/doctor/signup', signupDoctor);
router.post('/doctor/signin', signinDoctor);
router.get('/doctor/:id', reqAuth, getDoctorById);
router.put('/doctor/:id', reqAuth, updateDoctorById);
router.delete('/doctor/:id', reqAuth, deleteDoctorById);
router.put('/doctor/updatePassword', reqAuth, updateDoctorPassword);// Add password update route
router.get('/doctors', reqAuth, getAllDoctors); 

/** =========================
 *  Patient Routes
 *  ========================= */
router.post('/patient/signup'  ,signupPatient);
router.post('/patient/signin', signinPatient);
router.get('/patient/:id', reqAuth, getPatientById);
router.put('/patient/:id', reqAuth, updatePatientById);
router.delete('/patient/:id', reqAuth, deletePatientById);
router.put('/patient/updatePassword', reqAuth, updatePatientPassword); // Add password update route

/** =========================
 *  Consultation Routes
 *  ========================= */
router.post('/consultation', reqAuth, createConsultation); // Patient creates a consultation
router.get('/consultations/doctor/:doctorId', reqAuth, getConsultationsByDoctor); // Doctor views their consultations
router.get('/consultations/patient/:patientId', reqAuth, getConsultationsByPatient); // Patient views their consultations
router.put('/consultation/:id', reqAuth, updateConsultation); // Update consultation details
router.delete('/consultation/:id', reqAuth, deleteConsultation); // Delete consultation
router.get('/consultations', reqAuth, getAllConsultations); // Get all consultations

/** =========================
 *  Prescription Routes
 *  ========================= */
router.post('/prescription', reqAuth, createPrescription); // Doctor creates a prescription
router.get('/prescriptions/doctor/:doctorId', reqAuth, getPrescriptionsByDoctor); // Doctor views their prescriptions
router.get('/prescription/:id', reqAuth, getPrescriptionById); // View specific prescription
router.put('/prescription/:id', reqAuth, updatePrescription); // Doctor edits a prescription
router.delete('/prescription/:id', reqAuth, deletePrescription); // Delete prescription
router.get('/prescriptions/patient/:patientId', reqAuth, getPrescriptionsByPatientId); // Get all prescriptions for a patient
router.get('/prescriptions/doctor/:doctorId/patient/:patientId', reqAuth, getPrescriptionsByDoctorAndPatient); // Get all prescriptions for a patient

export default router;
