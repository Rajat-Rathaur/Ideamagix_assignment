import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import DoctorList from './DoctorCard';
import { UserIcon } from '@heroicons/react/24/outline'; // Import the profile icon from Heroicons

const PatientHome = () => {
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate(); // Hook to handle page navigation

    useEffect(() => {
        const fetchDoctors = async () => {
            // Get the token from localStorage
            const token = localStorage.getItem('token');
          
            // If there's no token, you might want to handle the case (e.g., redirect to login)
            if (!token) {
                console.error('No token found, please log in');
                return;
            }
    
            try {
                // Fetch doctors data with the token in the Authorization header
                const response = await fetch('http://localhost:5000/user/doctors', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Attach token as Bearer token
                    },
                });
    
                // If response is ok, parse the data
                if (response.ok) {
                    const data = await response.json();
                    setDoctors(data.doctors); // Set the doctors state
                    console.log('Doctors:', data.doctors);
                } else {
                    console.error('Error fetching doctors:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };
    
        fetchDoctors();
    }, []);

    // Function to navigate to the profile page
    const handleProfileClick = () => {
        // Get the user from localStorage (assuming it's stored as a JSON string)
        const user = JSON.parse(localStorage.getItem('user'));
      
    
        if (user && user.id) {
            // If user exists and has an id, navigate to their profile page
            navigate(`/patient/profile/${user.id}`);
        } else {
            console.error("User not found or no ID available.");
        }
    };
    
    

    return (
        <div className="p-4 bg-gray-900 text-white min-h-screen">
            {/* Profile Icon on the top-right */}
            <div className="absolute top-4 right-4">
    <button
        onClick={handleProfileClick}
        className="text-white p-2 rounded-full hover:bg-gray-800 focus:outline-none flex items-center space-x-2"
    >
      
        <span>Profile</span> 
        <UserIcon className="h-8 w-8" />
    </button>
</div>


            <h1 className="text-3xl font-semibold text-gray-100 mb-6">Doctors</h1>
            <DoctorList doctors={doctors} />
        </div>
    );
}

export default PatientHome;
