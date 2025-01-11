import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PatientProfile = () => {
  const { id } = useParams(); // Getting the patient ID from the URL
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    historyOfIllness: '',
    historyOfSurgery: '',
  });
  
  const baseUrl = 'http://localhost:5000'; // Ensure this is correct for your environment
  const navigate = useNavigate(); // Initialize navigate function for redirection

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No token found, please log in');
          return;
        }

        const response = await fetch(`${baseUrl}/user/patient/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPatient(data.patient);
          setFormData({
            name: data.patient.name,
            email: data.patient.email,
            phone: data.patient.phone,
            age: data.patient.age,
            historyOfIllness: data.patient.historyOfIllness || '',
            historyOfSurgery: data.patient.historyOfSurgery || '',
          });
        } else {
          setError('Failed to fetch patient data.');
        }
      } catch (error) {
        setError('Error fetching patient data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  const handleLogout = () => {
    // Clear the token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Optional: If you're storing user data separately in localStorage
    
    // Redirect to the login page
    navigate('/');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Toggle edit mode
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, please log in');
        return;
      }

      const response = await fetch(`${baseUrl}/user/patient/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setPatient(data.patient);
        setIsEditing(false); // Exit edit mode after successful update
      } else {
        setError('Failed to update patient data.');
      }
    } catch (error) {
      setError('Error updating patient data.');
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const profileImageUrl = patient.profilePicture
    ? `${baseUrl}${patient.profilePicture}` // Concatenate base URL with the image path
    : 'https://via.placeholder.com/150'; // Fallback image

  // Ensure that historyOfIllness and historyOfSurgery are arrays, if they are not, convert to empty array
  const historyOfIllness = Array.isArray(patient.historyOfIllness) ? patient.historyOfIllness : (patient.historyOfIllness ? [patient.historyOfIllness] : []);
  const historyOfSurgery = Array.isArray(patient.historyOfSurgery) ? patient.historyOfSurgery : (patient.historyOfSurgery ? [patient.historyOfSurgery] : []);

  // Join the arrays with commas or fallback to 'N/A'
  const illnessText = historyOfIllness.length > 0 ? historyOfIllness.join(', ') : 'N/A';
  const surgeryText = historyOfSurgery.length > 0 ? historyOfSurgery.join(', ') : 'N/A';

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img
            src={profileImageUrl}
            alt={patient.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
          />
        </div>

        <h1 className="text-3xl font-semibold text-center text-gray-100">{patient.name}</h1>
        <p className="text-center text-gray-400">{patient.age} years old</p>

        <div className="mt-6 space-y-4">
          {/* Display data as text or editable fields */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">Name:</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-800 text-white p-2 border border-gray-700 rounded-md"
                />
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">Email:</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-800 text-white p-2 border border-gray-700 rounded-md"
                />
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">Phone:</span>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-gray-800 text-white p-2 border border-gray-700 rounded-md"
                />
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">Age:</span>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="bg-gray-800 text-white p-2 border border-gray-700 rounded-md"
                />
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">History of Illness:</span>
                <input
                  type="text"
                  name="historyOfIllness"
                  value={formData.historyOfIllness}
                  onChange={handleChange}
                  className="bg-gray-800 text-white p-2 border border-gray-700 rounded-md"
                />
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">History of Surgery:</span>
                <input
                  type="text"
                  name="historyOfSurgery"
                  value={formData.historyOfSurgery}
                  onChange={handleChange}
                  className="bg-gray-800 text-white p-2 border border-gray-700 rounded-md"
                />
              </div>

              <div className="flex justify-center mt-6 space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">Email:</span>
                <span className="text-gray-400">{patient.email}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">Phone:</span>
                <span className="text-gray-400">{patient.phone}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">History of Illness:</span>
                <span className="text-gray-400">{illnessText}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">History of Surgery:</span>
                <span className="text-gray-400">{surgeryText}</span>
              </div>

              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={handleEditToggle} // Toggle edit mode
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none"
                >
                  Edit Profile
                </button>

                <button
                  onClick={handleLogout} // Trigger logout on click
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md focus:outline-none"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
