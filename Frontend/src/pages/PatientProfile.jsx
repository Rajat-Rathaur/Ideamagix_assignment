import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PatientProfile = () => {
  const { id } = useParams(); // Patient ID from URL
  const [profilePicture, setProfilePicture] = useState(null);
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

  const baseUrl = 'http://localhost:5000'; // Adjust this for your environment
  const navigate = useNavigate(); // For redirection

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
    localStorage.removeItem('token');
    navigate('/'); // Redirect to login
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, please log in');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('historyOfIllness', formData.historyOfIllness);
      formDataToSend.append('historyOfSurgery', formData.historyOfSurgery);

      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }

      const response = await fetch(`${baseUrl}/user/patient/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        setPatient(data.patient);
        setIsEditing(false); // Exit edit mode
        alert('Patient profile updated successfully');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update patient data.');
      }
    } catch (error) {
      setError('Error updating patient data.');
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const profileImageUrl = patient?.profilePicture
    ? `${baseUrl}${patient.profilePicture}`
    : 'https://via.placeholder.com/150';


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
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-between">
                <span className="font-semibold text-gray-300">Profile Picture:</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="bg-gray-800 text-white p-2 border border-gray-700 rounded-md"
                />
              </div>
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
                <textarea
                  name="historyOfIllness"
                  value={formData.historyOfIllness}
                  onChange={handleChange}
                  className="bg-gray-800 text-white p-2 border border-gray-700 rounded-md"
                />
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">History of Surgery:</span>
                <textarea
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
                <span className="text-gray-400">{patient.historyOfIllness || 'N/A'}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">History of Surgery:</span>
                <span className="text-gray-400">{patient.historyOfSurgery || 'N/A'}</span>
              </div>

              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={handleEditToggle}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none"
                >
                  Edit Profile
                </button>

                <button
                  onClick={handleLogout}
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
