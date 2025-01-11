import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf"; 

const DoctorPrescription = () => {
  const [consultations, setConsultations] = useState([]); 
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const[consultationId, setConsultationId] = useState(null);
  const [prescription, setPrescription] = useState({
    careInstructions: '',
    medicines: '',
  });

  const navigate = useNavigate();
  const doctorId = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    const fetchConsultations = async () => {      
      
      try {
        const response = await fetch(`http://localhost:5000/user/consultations/doctor/${doctorId.id}`, { 
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setConsultations(data);          
          console.log('Consultations:', data);
        } else {
          console.error('Error fetching consultations');
        }
      } catch (error) {
        console.error('Error fetching consultations:', error);
      }
    };

    fetchConsultations();
  }, []);

//   const handlePrescriptionSubmit = async () => {
//     // Validate prescription form
//     if (!prescription.careInstructions || !prescription.medicines) {
//         alert('Both fields are required');
//         return;
//     }

//     try {
//         // Generate the PDF of the prescription
//         const doc = new jsPDF();
//         doc.text(`Prescription for Consultation ID: ${consultationId}`, 10, 10);
//         doc.text(`Care to be Taken: ${prescription.careInstructions}`, 10, 20);
//         doc.text(`Medicines: ${prescription.medicines}`, 10, 30);

//         // Save the PDF file to a Blob
//         const pdfBlob = doc.output('blob');

//         // Create FormData instance
//         const formData = new FormData();

//         // Append the PDF file
//         formData.append('prescriptionPdf', pdfBlob, `Prescription_${consultationId}.pdf`);

//         // Append other prescription data as JSON string
//         const prescriptionData = {
//             consultationId: selectedConsultation._id,
//             doctorId: selectedConsultation.doctorId._id,
//             patientId: selectedConsultation.patientId._id,
//             careInstructions: prescription.careInstructions,
//             medicines: prescription.medicines,
//         };

//         // Append prescription data as a string
//         formData.append('prescriptionData', JSON.stringify(prescriptionData));

//         console.log('Sending prescription data:', prescriptionData);

//         const response = await fetch('http://localhost:5000/user/prescription', {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 // Don't set Content-Type header - let the browser set it with the boundary
//             },
//             body: formData // Send the FormData object directly
//         });

//         if (response.ok) {
//             const result = await response.json();
//             console.log('Prescription created successfully:', result);
//             alert('Prescription saved and PDF generated!');
//         } else {
//             const errorData = await response.json();
//             console.error('Error creating prescription:', errorData);
//             alert('Failed to save prescription. Please try again.');
//         }
//     } catch (error) {
//         console.error('Error submitting prescription:', error);
//         alert('An error occurred while saving the prescription.');
//     }
// };
const handlePrescriptionSubmit = async () => {
  if (!prescription.careInstructions || !prescription.medicines) {
      alert('Both fields are required');
      return;
  }

  try {
      // Generate the PDF
      const doc = new jsPDF();
      doc.text(`Prescription for Consultation ID: ${selectedConsultation._id}`, 10, 10);
      doc.text(`Care to be Taken: ${prescription.careInstructions}`, 10, 20);
      doc.text(`Medicines: ${prescription.medicines}`, 10, 30);

      // Get PDF blob
      const pdfBlob = doc.output('blob');

      // Create FormData
      const formData = new FormData();

      // Make sure this field name matches your multer configuration
      formData.append('prescriptionPdf', pdfBlob, `Prescription_${consultationId}.pdf`);
      
      // Add prescription data
      const prescriptionData = {
          consultationId: selectedConsultation._id,
          doctorId: selectedConsultation.doctorId._id,
          patientId: selectedConsultation.patientId._id,
          careInstructions: prescription.careInstructions,
          medicines: prescription.medicines,
      };

      // Add as string
      formData.append('prescriptionData', JSON.stringify(prescriptionData));

      // Log the FormData contents (for debugging)
      for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await fetch('http://localhost:5000/user/prescription', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              // Don't set Content-Type - browser will set it automatically
          },
          body: formData
      });

      if (response.ok) {
          const result = await response.json();
          console.log('Prescription created successfully:', result);
          alert('Prescription saved and PDF generated!');
      } else {
          const errorData = await response.json();
          console.error('Error creating prescription:', errorData);
          alert('Failed to save prescription: ' + (errorData.message || 'Unknown error'));
      }
  } catch (error) {
      console.error('Error submitting prescription:', error);
      alert('An error occurred while saving the prescription.');
  }
};
  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-100 mb-6">Consultations</h1>

        {/* Check if consultations is an array and has length */}
        {consultations && consultations.length === 0 ? (
          <p>No consultations found</p>
        ) : (
          <div className="space-y-4">
            {consultations && consultations.length > 0 && consultations.map((consultation) => (
              <div key={consultation._id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold">{consultation.patientId.name}</h3>
                <p className="text-sm text-gray-400">Consultation ID: {consultation._id}</p>
                <p className="text-sm text-gray-400">Patient Email: {consultation.patientId.email}</p>
                <p className="text-sm text-gray-400">Doctor: {consultation.doctorId.name} ({consultation.doctorId.specialty})</p>
                <p className="text-sm text-gray-400">Current Illness: {consultation.currentIllness}</p>
                <p className="text-sm text-gray-400">Recent Surgery: {consultation.recentSurgery}</p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => setSelectedConsultation(consultation)}
                >
                  Write Prescription
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Prescription Form */}
        {selectedConsultation && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-100">Write Prescription</h2>
            <div>
              <label className="block text-sm text-gray-400">Care Instructions</label>
              <textarea
                value={prescription.careInstructions}
                onChange={(e) => setPrescription({ ...prescription, careInstructions: e.target.value })}
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Medicines</label>
              <textarea
                value={prescription.medicines}
                onChange={(e) => setPrescription({ ...prescription, medicines: e.target.value })}
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
              />
            </div>
            <div>
              <button
                onClick={handlePrescriptionSubmit}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none"
              >
                Submit Prescription and Generate PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPrescription;
