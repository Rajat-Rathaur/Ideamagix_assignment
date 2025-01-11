import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { useParams } from 'react-router-dom';

const DoctorConsultation = () => {
  const { doctorId } = useParams();  // Get doctorId from URL
  const [doctor, setDoctor] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    currentIllness: '',
    recentSurgery: '',
    familyMedicalHistory: {
      diabeticStatus: '',
      allergies: '',
      others: ''
    },
    transactionId: ''
  });

  // Fetch doctor details using the doctorId from the URL
  useEffect(() => {
    const fetchDoctor = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found, please log in');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/user/doctor/${doctorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('familyMedicalHistory')) {
      setFormData({
        ...formData,
        familyMedicalHistory: {
          ...formData.familyMedicalHistory,
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

  // Validate if the form data is complete for each step
  const isStepValid = () => {
    if (step === 1) {
      return formData.currentIllness && formData.recentSurgery;
    }
    if (step === 2) {
      return formData.familyMedicalHistory.diabeticStatus && formData.familyMedicalHistory.allergies;
    }
    if (step === 3) {
      return formData.transactionId;
    }
    return false;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    const patientId = JSON.parse(localStorage.getItem('user')).id; 
  
    if (!token) {
      console.error('No token found, please log in');
      alert('You are not authenticated. Please log in.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/user/consultation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ doctorId, patientId,...formData })
      });
console.log(response);
console.log("formdata",formData)
      if (response.ok) {
        alert('Consultation details submitted successfully!');
       
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
          disabled={step === 1}
        >
          Step 1
        </button>
        <button
          onClick={() => setStep(2)}
          className={`ml-4 px-4 py-2 ${step === 2 ? 'bg-blue-600' : 'bg-gray-600'} text-white rounded-md`}
          disabled={step === 1 || !isStepValid()}
        >
          Step 2
        </button>
        <button
          onClick={() => setStep(3)}
          className={`ml-4 px-4 py-2 ${step === 3 ? 'bg-blue-600' : 'bg-gray-600'} text-white rounded-md`}
          disabled={step === 2 || !isStepValid()}
        >
          Step 3
        </button>
      </div>

      {/* Step 1: Illness and Surgery History */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="currentIllness" className="block text-sm text-gray-400">Current Illness History</label>
            <textarea
              id="currentIllness"
              name="currentIllness"
              className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
              value={formData.currentIllness}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="recentSurgery" className="block text-sm text-gray-400">Recent Surgery History (time span)</label>
            <textarea
              id="recentSurgery"
              name="recentSurgery"
              className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
              value={formData.recentSurgery}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}

      {/* Step 2: Family Medical History */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h1 className='text-3xl'>Family Medical History</h1>
            <label htmlFor="diabeticStatus" className="block text-sm text-gray-400">diabeticStatus</label>
            <div className="flex space-x-4">
              <div>
                <input
                  type="radio"
                  id="diabetic"
                  name="familyMedicalHistory.diabeticStatus"
                  value="Diabetic"
                  checked={formData.familyMedicalHistory.diabeticStatus === 'Diabetic'}
                  onChange={handleInputChange}
                />
                <label htmlFor="diabetic" className="text-sm text-gray-300">Diabetic</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="nonDiabetic"
                  name="familyMedicalHistory.diabeticStatus"
                  value="Non-Diabetic"
                  checked={formData.familyMedicalHistory.diabeticStatus === 'Non-Diabetic'}
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
              name="familyMedicalHistory.allergies"
              className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
              value={formData.familyMedicalHistory.allergies}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="others" className="block text-sm text-gray-400">Others</label>
            <input
              type="text"
              id="others"
              name="familyMedicalHistory.others"
              className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
              value={formData.familyMedicalHistory.others}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}

      {/* Step 3: Payment QR Code */}
      {step === 3 && (
        <div className="space-y-4">
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
              value={`http://localhost:5000/payment/${formData.transactionId}`}
              size={256}
              fgColor="#ffffff"
              bgColor="#000000"
            />
          </div>

          {/* Display QR Code Link */}
          <p className="text-sm text-gray-400 mt-2">
            Scan this QR code to complete your payment. Make sure to enter the transaction ID after completing the payment.
          </p>
        </div>
      )}

      {/* Step Navigation Buttons */}
      <div className="mt-6 flex justify-between">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back
          </button>
        )}

        {step < 3 && (
          <button
            onClick={() => setStep(step + 1)}
            className={`px-4 py-2 ${isStepValid() ? 'bg-blue-600' : 'bg-gray-600'} text-white rounded-md`}
            disabled={!isStepValid()}
          >
            Next
          </button>
        )}

        {step === 3 && (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit Consultation
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorConsultation;
