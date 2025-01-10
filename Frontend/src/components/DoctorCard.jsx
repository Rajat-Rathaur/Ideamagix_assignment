import React from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
    const navigate = useNavigate();
    // Base URL for the backend (replace with your actual server URL)
    const baseUrl = 'http://localhost:5000'; // Change this if your backend is hosted elsewhere
    
    // Construct the full image URL
    const profileImageUrl = doctor.profilePicture
        ? `${baseUrl}${doctor.profilePicture}` // Concatenate base URL with the image path
        : 'https://via.placeholder.com/150';  // Fallback image if profilePicture is missing

        const handleConsultClick = () => {
            navigate(`/consultation/${doctor._id}`);
          };
          const handlePrescriptionClick = () => {
            navigate(`/prescriptions/doctor/${doctor._id}`); // Redirect to the prescription page with doctor's ID
            
          };
    return (
        <div className="max-w-xs w-full bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700 transform transition-all duration-200 hover:scale-105 hover:shadow-xl">
            {/* Profile Picture */}
            <img
                src={profileImageUrl}
                alt={doctor.name}
                className="w-full h-56 object-cover"
            />
            <div className="p-4">
                {/* Doctor Name */}
                <h2 className="text-xl font-semibold text-gray-100">{doctor.name}</h2>
                
                {/* Specialty */}
                <p className="text-sm text-gray-400">{doctor.specialty}</p>

                {/* Contact Information */}
                <div className="mt-2 flex flex-col space-y-2">
                    <div className="flex items-center">
                        <span className="text-gray-500">📧</span>
                        <p className="ml-2 text-sm text-gray-300">{doctor.email}</p>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-500">📱</span>
                        <p className="ml-2 text-sm text-gray-300">{doctor.phone}</p>
                    </div>
                </div>

                {/* Experience */}
                <div className="mt-2">
                    <p className="text-sm text-gray-300">
                        <strong>Experience: </strong>{doctor.experience} years
                    </p>
                </div>
                {/* Book Appointment Button */}
                <div className="mt-4">
                <button
            onClick={handleConsultClick}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Consult
          </button>
                </div>
                <div className="mt-4">
          {/* Prescription button */}
          <button
            onClick={handlePrescriptionClick}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Prescription
          </button>
        </div>
                
            </div>
        </div>
    );
};

const DoctorList = ({ doctors }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
        </div>
    );
};

export default DoctorList;
