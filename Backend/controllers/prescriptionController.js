import Prescription from '../models/prescriptionModel.js';
import Consultation from '../models/consultationModel.js';
import PDFDocument from 'pdfkit'; // For generating PDFs
import fs from 'fs'; // For file system operations
import path from 'path';
import { upload } from '../middleware/fileUpload.js';
import multer from 'multer';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
/** =========================
 *  Create Prescription
 *  ========================= */
export const createPrescription = async (req, res) => {
    upload.single("prescriptionPdf")(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error parsing form data', error: err.message });
        }

        const { consultationId, careInstructions, medicines } = JSON.parse(req.body.prescriptionData);

        console.log("req.body",consultationId, careInstructions, medicines);
        console.log("req.file",req.file);

        try {
            // Ensure the consultation exists
            const consultation = await Consultation.findById(consultationId);
            if (!consultation) {
                return res.status(404).json({ message: 'Consultation not found' });
            }

            // Define the directory and file name to save the PDF
            const pdfPath = req.file ? `/uploads/${req.file.filename}` : null;

           console.log("fileName",pdfPath);

            // Create the prescription in the database, including the path to the PDF file
            const prescription = new Prescription({
                doctorId: consultation.doctorId,
                patientId: consultation.patientId,
                consultationId,
                careInstructions: careInstructions,
                medicines,
                pdfPath,
            });

            await prescription.save();

            return res.status(201).json({ message: 'Prescription created successfully', prescription });
        } catch (error) {
            res.status(500).json({ message: 'Error creating prescription', error: error.message });
        }
    });
};
/** =========================
 *  Get Prescriptions by Doctor
 *  ========================= */
export const getPrescriptionsByDoctor = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const prescriptions = await Prescription.find({ doctorId }).populate('patientId', 'name email');
        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
    }
};

/** =========================
 *  Get Prescription by ID
 *  ========================= */
export const getPrescriptionById = async (req, res) => {
    const { id } = req.params;

    try {
        const prescription = await Prescription.findById(id).populate('patientId', 'name email');
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        res.status(200).json(prescription);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching prescription', error: error.message });
    }
};

/** =========================
 *  Update Prescription
 *  ========================= */
export const updatePrescription = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedPrescription = await Prescription.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedPrescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        res.status(200).json({ message: 'Prescription updated successfully', updatedPrescription });
    } catch (error) {
        res.status(500).json({ message: 'Error updating prescription', error: error.message });
    }
};

/** =========================
 *  Delete Prescription
 *  ========================= */
export const deletePrescription = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPrescription = await Prescription.findByIdAndDelete(id);
        if (!deletedPrescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        res.status(200).json({ message: 'Prescription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting prescription', error: error.message });
    }
};

/** =========================
 *  Generate Prescription PDF
 *  ========================= */
export const generatePrescriptionPDF = async (req, res) => {
    const { id } = req.params;

    try {
        const prescription = await Prescription.findById(id).populate('patientId', 'name email');
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        const pdfPath = path.join('public', 'prescriptions', `${id}.pdf`);

        // Generate the PDF
        const pdfDoc = new PDFDocument();
        pdfDoc.pipe(fs.createWriteStream(pdfPath));

        pdfDoc.fontSize(20).text('Prescription', { align: 'center' });
        pdfDoc.moveDown();

        pdfDoc.fontSize(14).text(`Patient Name: ${prescription.patientId.name}`);
        pdfDoc.text(`Email: ${prescription.patientId.email}`);
        pdfDoc.text(`Care: ${prescription.care}`);
        pdfDoc.text(`Medicines: ${prescription.medicines}`);
        pdfDoc.end();

        res.status(200).json({ message: 'PDF generated successfully', pdfPath });
    } catch (error) {
        res.status(500).json({ message: 'Error generating PDF', error: error.message });
    }
};

/** =========================
 *  Send Prescription to Patient
 *  ========================= */
export const sendPrescriptionToPatient = async (req, res) => {
    const { id } = req.params;

    try {
        const prescription = await Prescription.findById(id).populate('patientId', 'email');
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        // Here you would use a library like Nodemailer to send the PDF
        // Example: Sending a message or an attachment
        res.status(200).json({ message: 'Prescription sent to patient successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending prescription', error: error.message });
    }
};
export const getPrescriptionsByPatientId = async (req, res) => {
    const { patientId } = req.params; // Extract patientId from the request URL

    try {
        // Find all prescriptions for the given patient ID
        const prescriptions = await Prescription.find({ patientId })
            .populate('doctorId', 'name specialty') // Populate doctor details if needed
            .populate('consultationId', 'currentIllness') // Populate consultation details if needed
            .exec();

        if (prescriptions.length === 0) {
            return res.status(404).json({ message: 'No prescriptions found for this patient' });
        }

        // Respond with the prescriptions
        res.status(200).json(prescriptions);
    } catch (error) {
        console.error('Error fetching prescriptions:', error.message);
        res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
    }
};

export const getPrescriptionsByDoctorAndPatient = async (req, res) => {
    const { doctorId, patientId } = req.params; // Extract both doctorId and patientId from params

    try {
        // Find prescriptions where both doctorId and patientId match
        const prescriptions = await Prescription.find({ doctorId, patientId })
            .populate('patientId', 'name email'); // Populate patient information

        // If no prescriptions found, return a message indicating so
        if (prescriptions.length === 0) {
            return res.status(404).json({ message: 'No prescriptions found for this doctor and patient' });
        }

        res.status(200).json(prescriptions); // Return the found prescriptions
    } catch (error) {
        res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
    }
};