import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Patient from '../models/patientModel.js';
import dotenv from 'dotenv';
import { upload } from '../middleware/fileUpload.js';
dotenv.config();
const SECRET = process.env.SECRET;
import updatePasswordValidation from '../validations/updatePasswordValidation.js'; // Assuming you have validation for updating passwords

// Signup Patient
const signupPatient = async (req, res) => {
    // Use Multer to handle the profile picture upload
    upload.single('profilePicture')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const { name, email, password, age, phone, historyOfSurgery, historyOfIllness } = req.body;
        

        try {
            // Check if patient already exists
            const existingPatient = await Patient.findOne({ email });
            if (existingPatient) {
                return res.status(400).json({ message: "Patient already exists" });
            }

            // Ensure password is present
            if (!password) {
                return res.status(400).json({ message: "Password is required" });
            }

            // Hash the password
            let hashedPassword = '';
            try {
                hashedPassword = await bcrypt.hash(password, 10);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Error hashing password" });
            }

            // Get the file URL from the upload (Multer stores it in the 'uploads/' folder)
            const profilePictureUrl = req.file ? `/uploads/${req.file.filename}` : null;

            // Create a new patient with the profile picture URL
            const newPatient = new Patient({
                name,
                email,
                password: hashedPassword,
                profilePicture: profilePictureUrl,  // Save the profile picture URL
                age,
                phone,
                historyOfSurgery,
                historyOfIllness
            });

            // Save the patient to the database
            await newPatient.save();

            // Generate a JWT token
            const token = jwt.sign({ email: newPatient.email, id: newPatient._id }, SECRET, { expiresIn: '1h' });

            // Set JWT token as a cookie
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });

            res.status(201).json({ message: "Patient signed up successfully", patient: newPatient });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    });
};

// Signin Patient
const signinPatient = async (req, res) => {
    const { email, password } = req.body;

    try {
        const patient = await Patient.findOne({ email });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Compare the password
        const matchPassword = await bcrypt.compare(password, patient.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        // Generate JWT token
        const token = jwt.sign({ email: patient.email, id: patient._id }, SECRET, { expiresIn: '1h' });

        // Send the token as a cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        const patientToSend = {
            name: patient.name,
            email: patient.email,
            id: patient._id,
            age: patient.age,
            phone: patient.phone,
            historyOfSurgery: patient.historyOfSurgery,
            historyOfIllness: patient.historyOfIllness,
            profilePicture: patient.profilePicture,
        };

        res.status(200).json({ patient: patientToSend, token, message: "Sign In successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Get Patient by ID
const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).select("-password");
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        return res.status(200).json({ patient });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// Update Patient by ID
const updatePatientById = async (req, res) => {
    try {
        const { name, email, age, phone, historyOfSurgery, historyOfIllness, profilePicture } = req.body;
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            { name, email, age, phone, historyOfSurgery, historyOfIllness, profilePicture },
            { new: true }
        );
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        return res.status(200).json({ patient });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// Delete Patient by ID
const deletePatientById = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        return res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// Update Patient Password
const updatePatientPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const matchPassword = await bcrypt.compare(oldPassword, patient.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        patient.password = hashedPassword;
        await patient.save();

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export { signupPatient, signinPatient, getPatientById, updatePatientById, deletePatientById, updatePatientPassword };
