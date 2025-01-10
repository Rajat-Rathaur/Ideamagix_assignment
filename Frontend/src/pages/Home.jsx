import React from 'react';
import { Stethoscope, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AuthButton({ icon: Icon, label, type, role }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === 'signup') {
      navigate(`/${role.toLowerCase()}/signup`);
    } else if (type === 'signin') {
      navigate(`/${role.toLowerCase()}/signin`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center space-x-2 bg-white/90 hover:bg-white/95 text-gray-800 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
    >
      <Icon className="w-5 h-5" />
      <span>{label} as {role}</span>
    </button>
  );
}

function AuthSection({ role }) {
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        {role} Portal
      </h2>
      <AuthButton
        icon={UserPlus}
        label="Sign Up"
        type="signup"
        role={role}
      />
      <AuthButton
        icon={LogIn}
        label="Sign In"
        type="signin"
        role={role}
      />
    </div>
  );
}

function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80')`,
      }}
    >
      <div className="max-w-6xl w-full mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Stethoscope className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Healthcare Portal
          </h1>
          <p className="text-xl text-gray-200">Access your healthcare services securely</p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto">
          <div className="bg-blue-900/30 p-8 rounded-xl backdrop-blur-sm">
            <AuthSection role="Doctor" />
          </div>
          
          <div className="bg-green-900/30 p-8 rounded-xl backdrop-blur-sm">
            <AuthSection role="Patient" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
