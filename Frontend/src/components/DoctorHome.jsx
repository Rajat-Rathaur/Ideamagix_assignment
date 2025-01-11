import React, { useState, useEffect } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // Import ArrowLeft from lucide-react

const DoctorHome = () => {
  const navigate = useNavigate(); // Use the navigate hook from react-router-dom
  const baseUrl = 'http://localhost:5000'; 
  const [doctor, setDoctor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profilePicture: '',
    specialty: '',
    experience: '',
  });

  // Fetch doctor data from the backend
  useEffect(() => {
    const fetchDoctorData = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
          
      if (!token) {
          console.error('No token found, please log in');
          return;
      }

      try {
        const response = await fetch(`http://localhost:5000/user/doctor/${user.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Bearer token for auth
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDoctor(data.doctor);
          setFormData({
            name: data.doctor.name,
            email: data.doctor.email,
            phone: data.doctor.phone,
            profilePicture: data.doctor.profilePicture,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/user/doctor/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Bearer token for auth
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setDoctor(data.updatedDoctor);
        setIsEditing(false); // Exit edit mode
      } else {
        console.error('Error updating doctor profile');
      }
    } catch (error) {
      console.error('Error updating doctor profile:', error);
    }
  };

  const handlePrescriptionClick = () => {
    // Navigate to the Prescription page
    navigate('/doctor/prescription'); // Adjust the URL as per your routing setup
  };

  const handleLogoutClick = () => {
    // Clear localStorage and navigate to the login page
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/'); // Adjust the URL as per your routing setup
  };

  const handleBackClick = () => {
    setIsEditing(false); // Cancel editing when back arrow is clicked
  };

  if (!doctor) {
    return <div>Loading...</div>; // Show loading if data is not yet fetched
  }

  const profileImageUrl = doctor.profilePicture
    ? `${baseUrl}${doctor.profilePicture}` // Concatenate base URL with the image path
    : 'https://via.placeholder.com/150'; // Default image if no profile picture

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        {/* Show the back arrow icon when in edit mode */}
        {isEditing && (
          <Link
            to="#"
            onClick={handleBackClick} // Use this to cancel the editing mode
            className="flex items-center text-blue-400 hover:text-blue-300 mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
            <span>Cancel</span>
          </Link>
        )}

        {/* Profile Display Section */}
        {!isEditing ? (
          <div className="flex justify-center mb-6">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />
          </div>
        ) : null}

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

          {/* Edit Button */}
          {!isEditing ? (
            <button
              onClick={handleEditClick}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
          ) : null}
        </div>

        {/* Buttons in the Same Line */}
        <div className="flex justify-between items-center mt-6">
          {/* Logout Button (Left Aligned) */}
          <button
            onClick={handleLogoutClick}
            className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>

          {/* Prescription Button (Centered) */}
          <button
            onClick={handlePrescriptionClick}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Go to Prescription Page
          </button>
        </div>

        {/* Edit Profile Form Section */}
        {isEditing && (
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div>
              <label className="block text-sm text-gray-400">Profile Picture (URL)</label>
              <input
                type="text"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
              />
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
