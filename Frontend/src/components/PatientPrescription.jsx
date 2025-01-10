import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PrescriptionPage = () => {
  const { doctorId } = useParams(); // Retrieve the doctorId from the URL
  const [doctor, setDoctor] = useState(null);
  const [prescription, setPrescription] = useState({
    illnessHistory: '',
    recentSurgery: '',
    familyMedicalHistory: {
      diabeticStatus: '',
      allergies: '',
      others: '',
    },
    payment: {
      qrCode: '',
      transactionId: '',
    }
  });

  useEffect(() => {
    // Fetch doctor details based on the doctorId
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/doctor/${doctorId}`);
        if (response.ok) {
          const data = await response.json();
          setDoctor(data.doctor);
        } else {
          console.error('Error fetching doctor details');
        }
      } catch (error) {
        console.error('Error fetching doctor details', error);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make API call to save the prescription
    try {
      const response = await fetch('http://localhost:5000/user/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          doctorId,
          ...prescription,
        }),
      });

      if (response.ok) {
        alert('Consultation submitted successfully');
      } else {
        console.error('Error submitting consultation');
      }
    } catch (error) {
      console.error('Error submitting consultation', error);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      {doctor ? (
        <>
          <h1 className="text-3xl font-semibold text-gray-100 mb-6">Consult with {doctor.name}</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Illness History and Recent Surgery */}
            <div>
              <label htmlFor="illnessHistory" className="block text-sm text-gray-400">Illness History</label>
              <textarea
                id="illnessHistory"
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
                value={prescription.illnessHistory}
                onChange={(e) => setPrescription({ ...prescription, illnessHistory: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="recentSurgery" className="block text-sm text-gray-400">Recent Surgery</label>
              <input
                type="text"
                id="recentSurgery"
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
                value={prescription.recentSurgery}
                onChange={(e) => setPrescription({ ...prescription, recentSurgery: e.target.value })}
              />
            </div>

            {/* Step 2: Family Medical History */}
            <div>
              <label htmlFor="diabeticStatus" className="block text-sm text-gray-400">Diabetic Status</label>
              <div className="flex space-x-4">
                <label>
                  <input
                    type="radio"
                    name="diabeticStatus"
                    value="Diabetic"
                    checked={prescription.familyMedicalHistory.diabeticStatus === 'Diabetic'}
                    onChange={(e) => setPrescription({ ...prescription, familyMedicalHistory: { ...prescription.familyMedicalHistory, diabeticStatus: e.target.value } })}
                  />
                  Diabetic
                </label>
                <label>
                  <input
                    type="radio"
                    name="diabeticStatus"
                    value="Non-Diabetic"
                    checked={prescription.familyMedicalHistory.diabeticStatus === 'Non-Diabetic'}
                    onChange={(e) => setPrescription({ ...prescription, familyMedicalHistory: { ...prescription.familyMedicalHistory, diabeticStatus: e.target.value } })}
                  />
                  Non-Diabetic
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="allergies" className="block text-sm text-gray-400">Allergies</label>
              <input
                type="text"
                id="allergies"
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
                value={prescription.familyMedicalHistory.allergies}
                onChange={(e) => setPrescription({ ...prescription, familyMedicalHistory: { ...prescription.familyMedicalHistory, allergies: e.target.value } })}
              />
            </div>

            <div>
              <label htmlFor="others" className="block text-sm text-gray-400">Other Conditions</label>
              <input
                type="text"
                id="others"
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
                value={prescription.familyMedicalHistory.others}
                onChange={(e) => setPrescription({ ...prescription, familyMedicalHistory: { ...prescription.familyMedicalHistory, others: e.target.value } })}
              />
            </div>

            {/* Step 3: Payment (QR Code & Transaction ID) */}
            <div>
              <label htmlFor="transactionId" className="block text-sm text-gray-400">Transaction ID</label>
              <input
                type="text"
                id="transactionId"
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
                value={prescription.payment.transactionId}
                onChange={(e) => setPrescription({ ...prescription, payment: { ...prescription.payment, transactionId: e.target.value } })}
              />
            </div>

            {/* QR Code Display (if needed, you can integrate a library to display the QR code) */}
            <div className="mt-4">
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none">
                Submit Consultation
              </button>
            </div>
          </form>
        </>
      ) : (
        <p>Loading doctor details...</p>
      )}
    </div>
  );
};

export default PrescriptionPage;
