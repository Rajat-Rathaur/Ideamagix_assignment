import React, { useEffect, useState } from 'react';
import DoctorList from './DoctorCard';

const PatientHome = () => {
    const [doctors, setDoctors] = useState([]);

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

    return (
        <div className="p-4 bg-gray-900 text-white min-h-screen">
            <h1 className="text-3xl font-semibold text-gray-100 mb-6">Doctors</h1>
            <DoctorList doctors={doctors} />
        </div>
    );
}

export default PatientHome;
