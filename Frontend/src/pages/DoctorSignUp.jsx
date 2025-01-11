import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, User, Mail, Phone, Briefcase, Clock , Lock} from 'lucide-react';
import axios from 'axios';
function DoctorSignUp() {
      const navigate = useNavigate();
   const [flashMessage, setFlashMessage] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    experience: '',
    password: '',
    profilePicture: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object to handle file upload
    const formDataToSend = new FormData();

    // Add the profile picture if it exists
    if (formData.profilePicture) {
        formDataToSend.append('profilePicture', formData.profilePicture);
    }

    // Add all other form fields to FormData
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('specialty', formData.specialty); // Doctor's specialty
    formDataToSend.append('experience', formData.experience); // Years of experience
    formDataToSend.append('password', formData.password); // Add password field

    try {
        console.log('Sending doctor signup request with image');
        const response = await axios.post('http://localhost:5000/user/doctor/signup', 
            formDataToSend,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        console.log('Response:', response);
        if (response.status === 201) {
            
            setFlashMessage("Signup successful!");
            navigate('/doctor/signin'); // Redirect to doctor dashboard/home
        } else {
            console.error('Signup failed:', response.data.message);
            setFlashMessage("Signup failed. Please try again.");
            navigate('/doctor/signup'); // Navigate back to signup page if failed
        }
    } catch (error) {
        console.error('Signup failed:', error);
        setFlashMessage("Signup failed. Please try again.");
        navigate('/doctor/signup'); // Navigate back to signup page if error occurred
    }
};

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center text-blue-400 hover:text-blue-300 mb-6 group">
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>
        <h2 className="text-center text-4xl font-bold text-white mb-2">
          Join as a Doctor
        </h2>
        <p className="text-center text-gray-400">Create your professional account</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-xl py-8 px-4 shadow-2xl rounded-2xl sm:px-10 border border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Profile Picture Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Profile Picture
              </label>
              <div className="mt-1 flex items-center">
                <label className="w-full flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-xl cursor-pointer hover:border-blue-500 transition-colors duration-200 bg-gray-900/50">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-400">
                      <span>Upload a photo</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                </label>
              </div>
              {formData.profilePicture && (
                                <div className="mt-4 flex justify-center">
                                    <img
                                        src={URL.createObjectURL(formData.profilePicture)} // Create a URL for the selected file
                                        alt="Selected Profile"
                                        className="rounded-xl h-32 w-32 object-cover"
                                    />
                                </div>
                            )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  required
                  className="block w-full px-4 py-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Specialty */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Specialty
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  required
                  className="block w-full px-4 py-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="Your medical specialty"
                />
                <Briefcase className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  required
                  className="block w-full px-4 py-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <input
                  type="tel"
                  required
                  className="block w-full px-4 py-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
                <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Years of Experience
              </label>
              <div className="mt-1 relative">
                <input
                  type="number"
                  step="0.1"
                  required
                  className="block w-full px-4 py-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Years of experience (e.g., 5.5)"
                />
                <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  required
                  className="block w-full px-4 py-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                />
                 <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-[1.02]"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-400">
                  Already have an account?{' '}
                  <Link to="/doctor/signin" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                    Sign In
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorSignUp;
