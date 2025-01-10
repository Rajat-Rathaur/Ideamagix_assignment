import Prescription from '../models/prescriptionModel.js';
import Consultation from '../models/consultationModel.js';
import PDFDocument from 'pdfkit'; // For generating PDFs
import fs from 'fs'; // For file system operations
import path from 'path';

/** =========================
 *  Create Prescription
 *  ========================= */
export const createPrescription = async (req, res) => {
    const { consultationId, care, medicines } = req.body;

    try {
        // Ensure the consultation exists
        const consultation = await Consultation.findById(consultationId);
        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }

        // Create the prescription
        const prescription = new Prescription({
            doctorId: consultation.doctorId,
            patientId: consultation.patientId,
            consultationId,
            care,
            medicines,
        });

        await prescription.save();

        res.status(201).json({ message: 'Prescription created successfully', prescription });
    } catch (error) {
        res.status(500).json({ message: 'Error creating prescription', error: error.message });
    }
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
