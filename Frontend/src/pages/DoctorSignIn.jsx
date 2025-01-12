import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

function DoctorSignIn() {
  const [flashMessage, setFlashMessage] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/user/doctor/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { doctor, token } = await response.json();
        
        // Store user data and token in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(doctor));
        
        // Calculate expiration time (1 hour from now)
        const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 1 day (24 hours)   
        localStorage.setItem('tokenExpiration', expirationTime);
      
        console.log('Login successful!');
        console.log('User:', doctor.name);  
        console.log('Token:', token);
        
        // Flash message to indicate success
        setFlashMessage('Login successful!');
        
        // Navigate to doctor home page after 1 second
        setTimeout(() => {
          navigate('/doctor/home');
        }, 1000);
      
        // Set a timeout to remove the token and user after 1 hour
        setTimeout(() => {
          const storedExpirationTime = localStorage.getItem('tokenExpiration');
          
          if (storedExpirationTime && Date.now() >= storedExpirationTime) {
            // Clear the token and user from localStorage after 1 hour
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('tokenExpiration');
            console.log('Token and user have been removed from localStorage due to expiration.');
            alert('Your session has expired. Please log in again.');
          }
        }, 60 * 60 * 1000); // Set the timeout to 1 hour
      }
       else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.message);
        setFlashMessage('Login failed. Please try again.');
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setFlashMessage('Login failed. Please try again.');
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
          Welcome Back, Doctor
        </h2>
        <p className="text-center text-gray-400">Sign in to access your dashboard</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-xl py-8 px-4 shadow-2xl rounded-2xl sm:px-10 border border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  placeholder="Enter your email"
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>

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

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-[1.02]"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/doctor/signup" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                    Sign Up
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

export default DoctorSignIn;