import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Upload, User, Mail, Phone, ClipboardList, Stethoscope, Lock } from 'lucide-react';

function PatientSignUp() {
    const navigate = useNavigate();
    const [flashMessage, setFlashMessage] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        email: '',
        phone: '',
        historyOfSurgery: '',
        historyOfIllness: '',
        password: '', // Added password to formData
    });
    const [profilePicture, setProfilePicture] = useState(null);
  

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create FormData object to handle file upload
        const formDataToSend = new FormData();

        // Add the profile picture if it exists
        if (profilePicture) {
            formDataToSend.append('profilePicture', profilePicture);
        }

        // Convert   historyOfSurgery and historyOfIllness to arrays
      /*   const   historyOfSurgeryArray = formData.  historyOfSurgery
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item !== '');

        const historyOfIllnessArray = formData.historyOfIllness
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item !== ''); */
          
    

        // Add all other form fields to FormData
        formDataToSend.append('name', formData.name);
        formDataToSend.append('age', formData.age);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('historyOfSurgery', formData.historyOfSurgery);  // Send as string
        formDataToSend.append('historyOfIllness', formData.historyOfIllness); 
        formDataToSend.append('password', formData.password); // Add password field

        try {
            console.log('Sending patient signup request with image');
            const response = await axios.post('http://localhost:5000/user/patient/signup', 
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
                navigate('/patient/signin');
            } else {
                console.error('Signup failed:', response.data.message);
                setFlashMessage("Signup failed. Please try again.");
                navigate('/patient/signup');
            }
        } catch (error) {
            console.error('Signup failed:', error);
            setFlashMessage("Signup failed. Please try again.");
            navigate('/patient/signup');
        }
    };

    const handleSurgeryChange = (e) => {
      const   historyOfSurgery = e.target.value;
      setFormData({ ...formData, historyOfSurgery });
  };

  // Handle illness input change
  const handleIllnessChange = (e) => {
      const historyOfIllness = e.target.value;
      setFormData({ ...formData, historyOfIllness });
  };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex items-center text-emerald-400 hover:text-emerald-300 mb-6 group">
                    <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                    <span>Back to Home</span>
                </Link>
                <h2 className="text-center text-4xl font-bold text-white mb-2">
                    Create Patient Account
                </h2>
                <p className="text-center text-gray-400">Join our healthcare platform</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-800/50 backdrop-blur-xl py-8 px-4 shadow-2xl rounded-2xl sm:px-10 border border-gray-700">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Profile Picture
                            </label>
                            <div className="mt-1 flex items-center">
                                <label className="w-full flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-xl cursor-pointer hover:border-emerald-500 transition-colors duration-200 bg-gray-900/50">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-400">
                                            <span>Upload a photo</span>
                                            <input
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={(e) => setProfilePicture(e.target.files[0])} // Update the profile picture state
                                            />
                                        </div>
                                    </div>
                                </label>
                            </div>
                            {profilePicture && (
                                <div className="mt-4 flex justify-center">
                                    <img
                                        src={URL.createObjectURL(profilePicture)} // Create a URL for the selected file
                                        alt="Selected Profile"
                                        className="rounded-xl h-32 w-32 object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Full Name
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type="text"
                                    required
                                    className="block w-full px-4 py-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your full name"
                                />
                                <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                        </div>

                        {/* Age Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Age
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type="number"
                                    required
                                    className="block w-full px-4 py-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    placeholder="Your age"
                                />
                                <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Email
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type="email"
                                    required
                                    className="block w-full px-4 py-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="your.email@example.com"
                                />
                                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                        </div>

                        {/* Phone Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Phone Number
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type="number"
                                    required
                                    className="block w-full px-4 py-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Enter your phone number"
                                />
                                <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type="password"
                                    required
                                    className="block w-full px-4 py-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Create a password"
                                />
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                        </div>

                       {/* Surgery History Input */}
<div>
    <label className="block text-sm font-medium text-gray-300">
        History of Surgery
    </label>
    <div className="mt-1 relative">
        <textarea
            rows={3}
            className="block w-full px-4 py-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            value={formData.historyOfSurgery}
            onChange={handleSurgeryChange}
            placeholder="Enter surgeries separated by commas"
        />
        <ClipboardList className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
    </div>
    <div className="mt-2">
    <h4 className="text-sm font-medium text-gray-300">Surgery History:</h4>
    <div className="mt-1">
        {/* Render the surgery history as comma-separated */}
        <span className="text-gray-400">
            {formData.historyOfSurgery.split(',').map((surgery, index) => {
                // Trim and filter out empty values
                const trimmedSurgery = surgery.trim();
                if (trimmedSurgery === "") return null;
                return (
                    <span key={index} className="bg-emerald-600 text-white py-1 px-3 rounded-full text-xs mr-2">
                        {trimmedSurgery}
                    </span>
                );
            })}
        </span>
    </div>
</div>
</div>

{/* Illness History Input */}
<div>
    <label className="block text-sm font-medium text-gray-300">
        History of Illness
    </label>
    <div className="mt-1 relative">
        <textarea
            rows={3}
            className="block w-full px-4 py-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            value={formData.historyOfIllness}
            onChange={handleIllnessChange}
            placeholder="Enter illnesses separated by commas"
        />
        <Stethoscope className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
    </div>
    <div className="mt-2">
    <h4 className="text-sm font-medium text-gray-300">Illness History:</h4>
    <div className="mt-1">
        {/* Render the illness history as comma-separated */}
        <span className="text-gray-400">
            {formData.historyOfIllness.split(',').map((illness, index) => {
                // Trim and filter out empty values
                const trimmedIllness = illness.trim();
                if (trimmedIllness === "") return null;
                return (
                    <span key={index} className="bg-emerald-600 text-white py-1 px-3 rounded-full text-xs mr-2">
                        {trimmedIllness}
                    </span>
                );
            })}
        </span>
    </div>
</div>
</div>


                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform transition-all duration-200 hover:scale-[1.02]"
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
                                    <Link to="/patient/signin" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
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

export default PatientSignUp;
