import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Doctor from '../models/doctorModel.js';
import dotenv from 'dotenv';
import { upload } from '../middleware/fileUpload.js';
dotenv.config();
const SECRET = process.env.SECRET;
import updatePasswordValidation from '../validations/updatePasswordValidation.js'
// Signup Doctor
const signupDoctor = async (req, res) => {
    // Use Multer to handle the profile picture upload
    upload.single('profilePicture')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const { name, email, password, specialty, phone, experience } = req.body;

        try {
            // Check if the doctor already exists
            const existingDoctor = await Doctor.findOne({ email });
            if (existingDoctor) {
                return res.status(400).json({ message: "Doctor already exists" });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Get the file URL from the upload (Multer stores it in the 'uploads/' folder)
            const profilePictureUrl = req.file ? `/uploads/${req.file.filename}` : null;

            console.log("profilePictureUrl",profilePictureUrl);
            // Create a new doctor with the profile picture URL
            const newDoctor = new Doctor({
                name,
                email,
                password: hashedPassword,
                profilePicture: profilePictureUrl,  // Save the profile picture URL
                specialty,
                phone,
                experience
            });

            // Save the doctor to the database
            await newDoctor.save();
            

            // Generate a JWT token
            const token = jwt.sign({ email: newDoctor.email, id: newDoctor._id }, SECRET, { expiresIn: '1h' });

            // Set JWT token as a cookie
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });

            res.status(201).json({ message: "Doctor signed up successfully", doctor: newDoctor });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    });
};

// Signin Doctor
const signinDoctor = async (req, res) => {
    const { email, password } = req.body;

    try {
        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Compare the password
        const matchPassword = await bcrypt.compare(password, doctor.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        // Generate JWT token
        const token = jwt.sign({ email: doctor.email, id: doctor._id }, SECRET, { expiresIn: '1h' });

        // Send the token as a cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        const doctorToSend = {
            name: doctor.name,
            email: doctor.email,
            id: doctor._id,
            specialty: doctor.specialty,
            phone: doctor.phone,
            experience: doctor.experience,
            profilePicture: doctor.profilePicture,
        };

        res.status(200).json({ doctor: doctorToSend, token, message: "Sign In successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Get Doctor by ID
const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).select("-password");
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        return res.status(200).json({ doctor });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// Update Doctor by ID
const updateDoctorById = async (req, res) => {
    try {
        const { name, email, specialty, phone, experience, profilePicture } = req.body;
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            { name, email, specialty, phone, experience, profilePicture },
            { new: true }
        );
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        return res.status(200).json({ doctor });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// Delete Doctor by ID
const deleteDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        return res.status(200).json({ message: "Doctor deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// Update Doctor Password
const updateDoctorPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const matchPassword = await bcrypt.compare(oldPassword, doctor.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        doctor.password = hashedPassword;
        await doctor.save();

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().select("-password"); // Exclude password from the response
        if (!doctors || doctors.length === 0) {
            return res.status(404).json({ message: "No doctors found" });
        }
        return res.status(200).json({ doctors });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export { signupDoctor, signinDoctor, getDoctorById, updateDoctorById, deleteDoctorById, updateDoctorPassword , getAllDoctors};
