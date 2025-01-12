import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // Import ArrowLeft from lucide-react
import axios from 'axios';

const DoctorHome = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const navigate = useNavigate(); // Use the navigate hook from react-router-dom
  const baseUrl = 'http://localhost:5000'; 
  const [doctor, setDoctor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profilePicture: null,
    specialty: '',
    experience: '',
  });

  // Fetch doctor data from the backend
  useEffect(() => {
    const fetchDoctorData = async () => {
   
      

      if (!token) {
        console.error('No token found, please log in');
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}/user/doctor/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = response.data;
          setDoctor(data.doctor);
          setFormData({
            name: data.doctor.name,
            email: data.doctor.email,
            phone: data.doctor.phone,
            profilePicture: null,
            specialty: data.doctor.specialty,
            experience: data.doctor.experience,
          });
        } else {
          console.error('Error fetching doctor data');
        }
      } catch (error) {
        console.error('Error fetching doctor data', error);
      }
    };

    fetchDoctorData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true); // Enable the edit mode
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePicture: file }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    if (formData.profilePicture) {
      formDataToSend.append('profilePicture', formData.profilePicture);
    }

    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('specialty', formData.specialty);
    formDataToSend.append('experience', formData.experience);

    try {
      const response = await axios.put(`${baseUrl}/user/doctor/${user.id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const data = response.data;
        console.log('Updated doctor:', data);
        setDoctor(data.doctor);
        setIsEditing(false); // Exit edit mode
        alert('Doctor profile updated successfully');
      } else {
        console.error('Error updating doctor profile');
        alert('Error updating doctor profile');
      }
    } catch (error) {
      console.error('Error updating doctor profile:', error);
    }
  };

  const handlePrescriptionClick = () => {
    navigate('/doctor/prescription');
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleBackClick = () => {
    setIsEditing(false);
  };

  if (!doctor) {
    return <div>Loading...</div>;
  }

  const profileImageUrl = doctor.profilePicture
    ? `${baseUrl}${doctor.profilePicture}`
    : 'https://via.placeholder.com/150';

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        {isEditing && (
          <Link
            to="#"
            onClick={handleBackClick}
            className="flex items-center text-blue-400 hover:text-blue-300 mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
            <span>Cancel</span>
          </Link>
        )}

        {!isEditing && (
          <div className="flex justify-center mb-6">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />
          </div>
        )}

        <h1 className="text-3xl font-semibold text-center text-gray-100">{doctor.name}</h1>
        <p className="text-center text-gray-400">{doctor.specialty}</p>
        <p className="text-center text-gray-400">{doctor.experience} years of experience</p>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-300">Email:</span>
            <span className="text-gray-400">{doctor.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-300">Phone:</span>
            <span className="text-gray-400">{doctor.phone}</span>
          </div>

          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleLogoutClick}
            className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>

          <button
            onClick={handlePrescriptionClick}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Go to Prescription Page
          </button>
        </div>

        {isEditing && (
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div>
              <label className="block text-sm text-gray-400">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
              />
              {formData.profilePicture && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={URL.createObjectURL(formData.profilePicture)}
                    alt="Selected Profile"
                    className="rounded-xl h-32 w-32 object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Specialty</label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Experience (in years)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DoctorHome;
