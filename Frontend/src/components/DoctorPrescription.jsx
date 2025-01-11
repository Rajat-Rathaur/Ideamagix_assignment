import React, { useEffect, useState } from 'react';
import { FileText, Download, Eye, AlertCircle, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { jsPDF } from "jspdf";
import { useNavigate } from 'react-router-dom';

const DoctorPrescription = () => {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [prescription, setPrescription] = useState({
    careInstructions: '',
    medicines: '',
  });
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedPdf, setExpandedPdf] = useState(null);
  const [activeView, setActiveView] = useState(null); // 'write' or 'view'
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
        } else {
          console.error('Error fetching consultations');
        }
      } catch (error) {
        console.error('Error fetching consultations:', error);
      }
    };

    fetchConsultations();
  }, []);

  const handleViewPrescription = async (patientId) => {
    setLoading(true);
    setError(null);
    setActiveView('view');
    try {
      const response = await fetch(
        `http://localhost:5000/user/prescriptions/doctor/${doctorId.id}/patient/${patientId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch prescriptions');
      }

      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWritePrescription = (consultation) => {
    setSelectedConsultation(consultation);
    setPrescriptions([]); // Clear any existing prescriptions
    setActiveView('write');
    setPrescription({ careInstructions: '', medicines: '' }); // Reset form
  };

  const togglePdfView = (prescriptionId) => {
    setExpandedPdf(expandedPdf === prescriptionId ? null : prescriptionId);
  };

  const handlePrescriptionSubmit = async () => {
    if (!prescription.careInstructions || !prescription.medicines) {
      alert('Both fields are required');
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text(`Prescription for Consultation ID: ${selectedConsultation._id}`, 10, 10);
      doc.text(`Care to be Taken: ${prescription.careInstructions}`, 10, 20);
      doc.text(`Medicines: ${prescription.medicines}`, 10, 30);

      const pdfBlob = doc.output('blob');
      const formData = new FormData();
      formData.append('prescriptionPdf', pdfBlob, `Prescription_${selectedConsultation._id}.pdf`);
      
      const prescriptionData = {
        consultationId: selectedConsultation._id,
        doctorId: selectedConsultation.doctorId._id,
        patientId: selectedConsultation.patientId._id,
        careInstructions: prescription.careInstructions,
        medicines: prescription.medicines,
      };

      formData.append('prescriptionData', JSON.stringify(prescriptionData));

      const response = await fetch('http://localhost:5000/user/prescription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert('Prescription saved and PDF generated!');
        // After successful submission, switch to view mode and refresh prescriptions
        handleViewPrescription(selectedConsultation.patientId._id);
      } else {
        const errorData = await response.json();
        alert('Failed to save prescription: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting prescription:', error);
      alert('An error occurred while saving the prescription.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center gap-2 text-lg text-gray-600">
          <Loader className="w-6 h-6 animate-spin" />
          Loading prescriptions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center gap-2 text-lg text-red-600">
          <AlertCircle className="w-6 h-6" />
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-100 mb-6">Consultations</h1>

        {consultations.length === 0 ? (
          <p>No consultations found</p>
        ) : (
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <div key={consultation._id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold">{consultation.patientId.name}</h3>
                <p className="text-sm text-gray-400">Consultation ID: {consultation._id}</p>
                <div className="mt-4 space-x-4">
                  <button
                    className={`px-4 py-2 rounded-md ${
                      activeView === 'view' && selectedConsultation?._id === consultation._id
                        ? 'bg-blue-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    onClick={() => {
                      setSelectedConsultation(consultation);
                      handleViewPrescription(consultation.patientId._id);
                    }}
                  >
                    View Prescription
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md ${
                      activeView === 'write' && selectedConsultation?._id === consultation._id
                        ? 'bg-blue-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    onClick={() => handleWritePrescription(consultation)}
                  >
                    Write Prescription
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Write Prescription Form */}
        {activeView === 'write' && selectedConsultation && (
          <div className="mt-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-100">  Write Prescription for {`${selectedConsultation.patientId.name}`}</h2>
              <button
                onClick={() => setActiveView(null)}
                className="text-sm text-gray-400 hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
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

        {/* View Prescriptions */}
        {activeView === 'view' && prescriptions.length > 0 && (
          <div className="space-y-4 mt-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-100">Prescriptions</h2>
              <button
                onClick={() => setActiveView(null)}
                className="text-sm text-gray-400 hover:text-gray-200"
              >
                Close
              </button>
            </div>
            {prescriptions.map((prescription) => (
              <div key={prescription._id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-100">Prescription Details</h3>
                  <span className="text-sm text-gray-400">
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm text-gray-400">Medicines:</h4>
                  <p className="text-sm text-gray-200">{prescription.medicines}</p>
                  <h4 className="text-sm text-gray-400 mt-2">Care Instructions:</h4>
                  <p className="text-sm text-gray-200">{prescription.careInstructions}</p>
                </div>
                
                {prescription.pdfPath && prescription.pdfPath !== "/uploads/undefined" && (
                  <div className="mt-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => togglePdfView(prescription._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                        {expandedPdf === prescription._id ? 'Hide PDF' : 'View PDF'}
                        {expandedPdf === prescription._id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      <a
                        href={`http://localhost:5000${prescription.pdfPath}`}
                        download={`prescription-${prescription._id}.pdf`}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        <Download className="h-4 w-4" />
                        Download PDF
                      </a>
                    </div>

                    {expandedPdf === prescription._id && (
                      <div className="mt-4">
                        <iframe
                          src={`http://localhost:5000${prescription.pdfPath}`}
                          title={`Prescription ${prescription._id}`}
                          className="w-full h-80"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPrescription;