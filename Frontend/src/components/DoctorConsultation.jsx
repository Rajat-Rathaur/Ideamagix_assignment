import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { useParams } from 'react-router-dom';

const DoctorConsultation = () => {
  const { doctorId } = useParams();  // Get doctorId from URL
  const [doctor, setDoctor] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    illnessHistory: '',
    surgeryHistory: '',
    familyHistory: {
      diabetes: '',
      allergies: '',
      others: ''
    },
    transactionId: ''
  });

  useEffect(() => {
    // Fetch doctor details using the doctorId from the URL
    const fetchDoctor = async () => {
        const token = localStorage.getItem('token');
          
        // If there's no token, you might want to handle the case (e.g., redirect to login)
        if (!token) {
            console.error('No token found, please log in');
            return;
        }
      try {
        const response = await fetch(`http://localhost:5000/user/doctor/${doctorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Attach token as Bearer token
            },
        });
        const data = await response.json();
        setDoctor(data.doctor);
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('familyHistory')) {
      setFormData({
        ...formData,
        familyHistory: {
          ...formData.familyHistory,
          [name.split('.')[1]]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Save consultation data to the database
    try {
      const response = await fetch(`http://localhost:5000/user/consultation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctorId, ...formData })
      });

      if (response.ok) {
        alert('Consultation details submitted successfully!');
        // Redirect to a confirmation page or home
      } else {
        alert('Failed to submit consultation details');
      }
    } catch (error) {
      console.error('Error submitting consultation:', error);
      alert('Failed to submit consultation details');
    }
  };

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-100 mb-6">Consultation with Dr. {doctor.name}</h1>
      
      {/* Step Navigation */}
      <div className="mb-6">
        <button
          onClick={() => setStep(1)}
          className={`px-4 py-2 ${step === 1 ? 'bg-blue-600' : 'bg-gray-600'} text-white rounded-md`}
        >
          Step 1
        </button>
        <button
          onClick={() => setStep(2)}
          className={`ml-4 px-4 py-2 ${step === 2 ? 'bg-blue-600' : 'bg-gray-600'} text-white rounded-md`}
        >
          Step 2
        </button>
        <button
          onClick={() => setStep(3)}
          className={`ml-4 px-4 py-2 ${step === 3 ? 'bg-blue-600' : 'bg-gray-600'} text-white rounded-md`}
        >
          Step 3
        </button>
      </div>

      {/* Step 1: Illness and Surgery History */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="illnessHistory" className="block text-sm text-gray-400">Current Illness History</label>
            <textarea
              id="illnessHistory"
              name="illnessHistory"
              className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
              value={formData.illnessHistory}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="surgeryHistory" className="block text-sm text-gray-400">Recent Surgery History (time span)</label>
            <textarea
              id="surgeryHistory"
              name="surgeryHistory"
              className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
              value={formData.surgeryHistory}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}

      {/* Step 2: Family Medical History */}
      {step === 2 && (
        <div className="space-y-4">
           
          <div>
          <h1 className='text-3xl'>Family medical history</h1>
            <label htmlFor="diabetes" className="block text-sm text-gray-400">Diabetes</label>
            <div className="flex space-x-4">
              <div>
                <input
                  type="radio"
                  id="diabetic"
                  name="familyHistory.diabetes"
                  value="Diabetic"
                  checked={formData.familyHistory.diabetes === 'Diabetic'}
                  onChange={handleInputChange}
                />
                <label htmlFor="diabetic" className="text-sm text-gray-300">Diabetic</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="nonDiabetic"
                  name="familyHistory.diabetes"
                  value="Non-Diabetic"
                  checked={formData.familyHistory.diabetes === 'Non-Diabetic'}
                  onChange={handleInputChange}
                />
                <label htmlFor="nonDiabetic" className="text-sm text-gray-300">Non-Diabetic</label>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="allergies" className="block text-sm text-gray-400">Any Allergies</label>
            <input
              type="text"
              id="allergies"
              name="familyHistory.allergies"
              className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
              value={formData.familyHistory.allergies}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="others" className="block text-sm text-gray-400">Others</label>
            <input
              type="text"
              id="others"
              name="familyHistory.others"
              className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
              value={formData.familyHistory.others}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}

      {/* Step 3: Payment QR Code */}
      {step === 3 && (
  <div className="space-y-4">
    {/* Transaction ID Input */}
    <div>
      <label htmlFor="transactionId" className="block text-sm text-gray-400">Transaction ID</label>
      <input
        type="text"
        id="transactionId"
        name="transactionId"
        className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
        value={formData.transactionId}
        onChange={handleInputChange}
      />
    </div>

    {/* Generate QR Code */}
    <div className="mt-4">
      <QRCode
        value={`http://localhost:5000/payment/${formData.transactionId}`}  // The URL or data for payment
        size={256}
        fgColor="#ffffff"  // QR code color
        bgColor="#000000"  // Background color of QR code
      />
    </div>

    {/* Display QR Code Link */}
    <p className="text-sm text-gray-400 mt-2">
      Scan this QR code to complete your payment. Make sure to enter the transaction ID after completing the payment.
    </p>
  </div>
)}


      {/* Submit Button */}
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Submit Consultation
        </button>
      </div>
    </div>
  );
};

export default DoctorConsultation;
